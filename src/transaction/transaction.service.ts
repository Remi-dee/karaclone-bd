import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import ErrorHandler from '../utils/ErrorHandler';
import { PaystackService } from '../paystack/paystack.service';
import { FundWalletDTO } from './transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class TransactionService {
  private readonly paystackService: PaystackService;
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // fund wallet with local currency
  async fundWalletService(
    id: ObjectId,
    fundWalletBody: FundWalletDTO,
  ): Promise<any> {
    const { currency_code, amount } = fundWalletBody;
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new ErrorHandler('User not found', 400);
    }

    const fundWallet = this.paystackService.initializeTransaction(
      amount,
      user.email,
    );

    console.log('Response', fundWallet);

    return fundWallet;
  }
}
