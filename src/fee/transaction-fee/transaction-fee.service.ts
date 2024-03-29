import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TransactionFee,
  TransactionFeeDocument,
} from './schema/transaction-fee.schema';
import { Model, ObjectId } from 'mongoose';
import {
  CreateTransactionFeeDTO,
  UpdateTransactionFeeDTO,
} from './transaction-fee.dto';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class TransactionFeeService {
  constructor(
    @InjectModel(TransactionFee.name)
    private readonly transactionFeeModel: Model<TransactionFeeDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAll(): Promise<TransactionFee[]> {
    return await this.transactionFeeModel.find().exec();
  }

  async createTransactionFee(
    userId: ObjectId,
    transactionFeeData: CreateTransactionFeeDTO,
  ): Promise<TransactionFee> {
    // Check if the user is an admin
    await this.checkAdminPermission(userId);

    // Create the transaction fee
    const createdTransactionFee =
      await this.transactionFeeModel.create(transactionFeeData);

    // Return the created transaction fee(s)
    return createdTransactionFee;
  }

  async updateTransactionFee(
    userId: ObjectId,
    feeId: ObjectId,
    updateData: UpdateTransactionFeeDTO,
  ): Promise<TransactionFee> {
    // Check if the user is an admin
    await this.checkAdminPermission(userId);

    // Find the transaction fee by ID
    const existingFee = await this.transactionFeeModel.findById(feeId).exec();

    if (!existingFee) {
      throw new Error('Transaction fee not found');
    }

    // Update the transaction fee with the new data
    Object.assign(existingFee, updateData);
    const updatedFee = await existingFee.save();

    // Return the updated transaction fee
    return updatedFee;
  }

  async deleteTransactionFee(
    userId: ObjectId,
    feeId: ObjectId,
  ): Promise<boolean> {
    // Check if the user is an admin
    await this.checkAdminPermission(userId);

    // Find the transaction fee by ID and delete it
    const result = await this.transactionFeeModel
      .deleteOne({ _id: feeId })
      .exec();

    if (result.deletedCount !== 0) {
      return true;
    } else {
      throw new Error('Transaction fee not found');
    }
  }

  private async checkAdminPermission(userId: ObjectId): Promise<void> {
    // Find the user by ID
    const user = await this.userModel.findById(userId).exec();

    // Check if user exists and is an admin
    if (!user || user.account_type !== 'admin') {
      throw new Error(
        'User not found or not authorized to manage transaction fees',
      );
    }
  }
}
