import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import ErrorHandler from '../utils/ErrorHandler';
import { PaystackService } from '../paystack/paystack.service';
import { FundWalletDTO } from './transaction.dto';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateWalletDTO, UpdateWalletDTO } from '../wallet/wallet.dto';
import { Transaction, TransactionDocument } from './transaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactModel: Model<TransactionDocument>,
    private paystackService: PaystackService,
    private userService: UserService,
    private walletService: WalletService,
  ) {}

  // fund wallet with local currency
  async fundWalletService(
    id: ObjectId,
    fundWalletBody: FundWalletDTO,
  ): Promise<any> {
    const { currency_code, amount } = fundWalletBody;
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new ErrorHandler('User not found', 400);
    }

    const newWallet = {
      currency_code: currency_code,
      escrow_balance: amount,
    } as CreateWalletDTO;

    const userWallets = await this.walletService.getAllWalletsByUser(user._id);

    if (userWallets.length <= 0) {
      const walletcreate = await this.walletService.createWallet(
        user._id,
        newWallet,
      );

      const fundWallet = await this.paystackService.initializeTransaction(
        amount,
        user.email,
      );

      const createTransaction = await this.transactModel.create({
        type: 'paystack',
        amount: amount,
        reference_number: fundWallet.reference,
      });

      walletcreate.transactions.push(createTransaction);
      await walletcreate.save();

      return createTransaction;
    } else if (userWallets.length > 0) {
      const updates = userWallets.map(async (wallet) => {
        if (wallet.currency_code == currency_code) {
          const update = {
            escrow_balance: wallet.escrow_balance + amount,
          } as UpdateWalletDTO;

          const updateWallet = await this.walletService.updateWallet(
            wallet._id,
            update,
          );

          const fundWallet = await this.paystackService.initializeTransaction(
            amount,
            user.email,
          );

          const createTransaction = await this.transactModel.create({
            type: 'paystack',
            amount: amount,
            reference_number: fundWallet.reference,
          });

          // Push the newly created transaction to the wallet's transactions array
          updateWallet.transactions.push(createTransaction);
          await updateWallet.save(); // Save the updated wallet

          return createTransaction;
        }
      });

      return Promise.all(updates);
    }
  }
}
