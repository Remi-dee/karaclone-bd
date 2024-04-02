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
import ErrorHandler from 'src/utils/ErrorHandler';

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
  ): Promise<TransactionFee | any> {
    await this.checkAdminPermission(userId);

    const createdTransactionFee =
      await this.transactionFeeModel.create(transactionFeeData);

    return { message: 'Successfully Created', createdTransactionFee };
  }

  async updateTransactionFee(
    userId: ObjectId,
    feeId: ObjectId,
    updateData: UpdateTransactionFeeDTO,
  ): Promise<TransactionFee> {
    await this.checkAdminPermission(userId);

    const existingFee = await this.transactionFeeModel.findById(feeId).exec();

    if (!existingFee) {
      throw new Error('Transaction fee not found');
    }

    Object.assign(existingFee, updateData);
    const updatedFee = await existingFee.save();

    return updatedFee;
  }

  async deleteTransactionFee(feeId: ObjectId, userId: ObjectId): Promise<any> {
    await this.checkAdminPermission(userId);

    const transactionFee = await this.transactionFeeModel
      .findById(feeId)
      .exec();

    if (!transactionFee) {
      throw new ErrorHandler('Failed to fetch updated transaction fee', 500);
    }

    const deletedDocument = await this.transactionFeeModel.findByIdAndDelete(
      transactionFee._id,
    );

    if (!deletedDocument) {
      throw new ErrorHandler('Transaction fee not found', 404);
    } else return { message: 'Successfully Deleted', success: true };
  }
  private async checkAdminPermission(userId: ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();

    if (!user || user.role !== 'superadmin') {
      throw new Error(
        'User not found or not authorized to manage transaction fees',
      );
    }
  }
}
