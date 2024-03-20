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

    const userWallets = await this.walletService.findWalletsByUser(user._id);

    const fundWallet = await this.paystackService.initializeTransaction(
      amount,
      user.email,
    );

    const newWallet = {
      userId: user._id.toString(),
      currency_code: currency_code,
    } as CreateWalletDTO;

    // update wallet if already existing or create a new one
    let walletUpdated = false;
    for (const wallet of userWallets) {
      if (wallet.currency_code === currency_code) {
        const update = {
          escrow_balance: wallet.escrow_balance + amount,
        } as UpdateWalletDTO;

        await this.walletService.updateWallet(wallet._id, update);
        walletUpdated = true;
        break;
      }
    }

    if (walletUpdated != true) {
      const walletcreate = await this.walletService.createWallet(
        user?._id,
        newWallet,
      );

      const createTransaction = await this.transactModel.create({
        type: 'paystack',
        amount: amount,
        reference_number: fundWallet.reference,
      });

      walletcreate.transactions.push(createTransaction);

      return createTransaction;
    }
  }
}
