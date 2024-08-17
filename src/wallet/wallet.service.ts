import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateWalletDTO, UpdateWalletDTO } from './wallet.dto';
import { Wallet, WalletDocument } from './wallet.schema';
import { UserTransactionsService } from 'src/users-transactions/user-transactions.service';
import { TradeService } from 'src/trade/trade.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly _walletModel: Model<WalletDocument>,

    private userTransactionsService: UserTransactionsService,
    private readonly tradeService: TradeService,
    private notificationService: NotificationService,
  ) {}

  async findOneById(id: Types.ObjectId): Promise<Wallet | null> {
    return await this._walletModel.findById(id).exec();
  }

  async getAllWalletsByUser(userId: Types.ObjectId): Promise<Wallet[]> {
    // Check if the user has any wallets
    let wallets = await this._walletModel.find({ user: userId }).exec();

    // If no wallets found, create default wallets
    if (wallets.length === 0) {
      const defaultWallets = [
        { user: userId, currency_code: 'GBP', escrow_balance: 0.0 },
        { user: userId, currency_code: 'NGN', escrow_balance: 0.0 },
      ];

      wallets = await this._walletModel.insertMany(defaultWallets);
    }

    return wallets;
  }

  async createWallet(walletData: CreateWalletDTO): Promise<Wallet | any> {
    const existingWallet = await this._walletModel
      .findOne({
        user: walletData.user,
        currency_code: walletData.currency_code,
      })
      .exec();

    if (!existingWallet) {
      const createdWallet = new this._walletModel(walletData);
      return await createdWallet.save();
    }

    return existingWallet;
  }

  async updateWallet(
    id: Types.ObjectId,
    updateWalletDTO: UpdateWalletDTO,
  ): Promise<Wallet | undefined | any> {
    const updatedWallet = await this._walletModel
      .findByIdAndUpdate(id, updateWalletDTO, {
        new: true, // Return the updated document
      })
      .exec();
    return updatedWallet;
  }

  async deleteAllWalletsByUser(userId: Types.ObjectId): Promise<void> {
    await this._walletModel.deleteMany({ user: userId }).exec();
  }

  async fundWallet(
    userId: Types.ObjectId,
    fundWalletDTO: CreateWalletDTO,
  ): Promise<Wallet> {
    const { currency_code, amount } = fundWalletDTO;

    const wallet = await this._walletModel
      .findOne({ user: userId, currency_code })
      .exec();

    if (wallet) {
      wallet.escrow_balance += amount;
      await wallet.save();
    } else {
      const newWallet = new this._walletModel({
        user: userId,
        currency_code,
        amount,
      });

      const transactionData = {
        user_transactionId: this.tradeService.generateTradeId(),
        date: new Date().toLocaleString(),
        transaction_type: 'Deposit',
        bank_name: 'N/A',
        account_name: 'N/A',
        transaction_fee: 2.35,
        status: 'Successful',
        payment_method: 'Connect with bank',
        beneficiary_name: 'N/A',
        beneficiary_account: 'N/A',
        beneficiary_bank: 'N/A',
        currency: fundWalletDTO.currency_code,
        user_id: fundWalletDTO.user,
        amount_exchanged: 'N/A',
        amount_received: 'N/A',
        amount_reversed: 'N/A',
        amount_deposited: amount.toString(),
        amount_sold: 'N/A',
        rate: 'N/A',
      };

      const transaction =
        await this.userTransactionsService.create(transactionData);
      console.log('transaction is', transaction);

      await this.notificationService.createNotification(
        userId.toString(),
        `Wallet funded with ID: ${transactionData.user_transactionId}`,
        'Deposit',
      );

      return await newWallet.save();
    }
  }

  async createDefaultWallets(userId: Types.ObjectId): Promise<void> {
    const defaultCurrencies = ['GBP', 'NGN'];
    for (const currency_code of defaultCurrencies) {
      await this.createWallet({
        user: userId,
        currency_code,
        amount: 0.0,
      });
    }
  }

  async deductWallet(
    userId: Types.ObjectId,
    amount: number,
    currencyCode: string,
    session: any,
  ): Promise<Wallet | null> {
    const wallet = await this._walletModel
      .findOne({ user: userId, currency_code: currencyCode })
      .session(session);
    if (!wallet) {
      throw new Error(`Wallet with currency ${currencyCode} not found`);
    }

    if (wallet.escrow_balance < amount) {
      throw new Error('Insufficient funds in the wallet');
    }

    wallet.escrow_balance -= amount;
    return await wallet.save();
  }
}
