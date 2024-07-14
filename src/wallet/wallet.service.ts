import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateWalletDTO, UpdateWalletDTO } from './wallet.dto';
import { Wallet, WalletDocument } from './wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly _walletModel: Model<WalletDocument>,
  ) {}

  async findOneById(id: ObjectId): Promise<Wallet | null> {
    return await this._walletModel.findById(id).exec();
  }

  async getAllWalletsByUser(userId: ObjectId): Promise<Wallet[]> {
    return await this._walletModel.find({ user: userId }).exec();
  }

  async createWallet(walletData: CreateWalletDTO): Promise<Wallet | any> {
    const createdWallet = new this._walletModel(walletData);
    return await createdWallet.save();
  }

  async updateWallet(
    id: ObjectId,
    updateWalletDTO: UpdateWalletDTO,
  ): Promise<Wallet | undefined | any> {
    const updatedWallet = await this._walletModel
      .findByIdAndUpdate(id, updateWalletDTO, {
        new: true, // Return the updated document
      })
      .exec();
    return updatedWallet;
  }

  async deleteAllWalletsByUser(userId: ObjectId): Promise<void> {
    await this._walletModel.deleteMany({ user: userId }).exec();
  }

  async fundWallet(
    userId: ObjectId,
    fundWalletDTO: CreateWalletDTO,
  ): Promise<Wallet> {
    const { currency_code, escrow_balance } = fundWalletDTO;

    const wallet = await this._walletModel
      .findOne({ user: userId, currency_code })
      .exec();

    if (wallet) {
      wallet.escrow_balance += escrow_balance;
      return await wallet.save();
    } else {
      const newWallet = new this._walletModel({
        user: userId,
        currency_code,
        escrow_balance,
      });
      return await newWallet.save();
    }
  }
}
