import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateWalletDTO, UpdateWalletDTO } from './wallet.dto';
import { Wallet, WalletDocument } from './wallet.schema';
import { User, UserDocument } from '../user/user.schema';
import ErrorHandler from '../utils/ErrorHandler';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly _walletModel: Model<WalletDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOneById(id: ObjectId): Promise<Wallet | null> {
    return await this._walletModel.findById(id).exec();
  }

  async getAllWalletsByUser(userId: ObjectId): Promise<Wallet[]> {
    const userWithWallets = await this.userModel
      .findById(userId)
      .populate('wallets')
      .exec();

    if (!userWithWallets) {
      throw new ErrorHandler('unable to fetch user wallets', 400);
    }
    return userWithWallets.wallets;
  }

  async createWallet(
    userId: ObjectId,
    walletData: CreateWalletDTO,
  ): Promise<Wallet | any> {
    const createdWallet = new this._walletModel(walletData);
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('User not found');
    }

    user.wallets.push(createdWallet);
    await user.save();

    return createdWallet.save();
  }

  async updateWallet(
    id: ObjectId,
    updateWalletDTO: UpdateWalletDTO,
  ): Promise<Wallet | undefined | any> {
    const updatedWallet = await this._walletModel
      .findByIdAndUpdate(id, updateWalletDTO, {
        new: true,
      })
      .populate('transactions')
      .exec();
    return updatedWallet;
  }
}
