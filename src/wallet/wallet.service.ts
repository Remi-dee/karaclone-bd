import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateWalletDTO, UpdateWalletDTO } from './wallet.dto';
import { Wallet, WalletDocument } from './wallet.schema';
import { User, UserDocument } from '../user/user.schema';

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

  async findWalletsByUser(id: ObjectId): Promise<Wallet[]> {
    try {
      const wallets = await this._walletModel.find({ user: id }).exec();
      return wallets;
    } catch (error) {
      console.error('Error finding wallets for user:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  async createWallet(
    userId: ObjectId,
    walletData: CreateWalletDTO,
  ): Promise<Wallet> {
    const createdWallet = new this._walletModel(walletData);
    const user = await this.userModel.findById(userId).exec();

    console.log('created wallet', createdWallet);

    if (!user) {
      throw new Error('User not found');
    }

    user.wallets.push(createdWallet);
    await user.save();

    return createdWallet.save();
  }

  // async getAllByUserId(userId: ObjectId): Promise<Wallet[] | undefined> {
  //   const wallet = await this._walletModel
  //     .find({ user: userId, isDeleted: false })
  //     .sort({ updatedAt: -1 })
  //     .lean()
  //     .exec();

  //   return wallet;
  // }

  // async createWallet(
  //   createWalletDto: CreateWalletDTO,
  // ): Promise<Wallet | undefined> {
  //   const [wallet] = await this._walletModel.create([
  //     {
  //       ...createWalletDto,
  //       user: new ObjectId(createWalletDto.userId),
  //     },
  //   ]);

  //   return wallet;
  // }

  async updateWallet(
    id: ObjectId,
    updateWalletDTO: UpdateWalletDTO,
  ): Promise<Wallet | undefined | any> {
    console.log(id);
    console.log(updateWalletDTO);
    return await this._walletModel.findByIdAndUpdate(id, updateWalletDTO, {
      new: true,
    });
  }
}
