import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConversionFee,
  ConversionFeeDocument,
} from './schema/conversion-fee.schema';
import { Model, ObjectId } from 'mongoose';
import {
  CreateConversionFeeDTO,
  UpdateConversionFeeDTO,
} from './conversion-fee.dto';
import { User, UserDocument } from 'src/user/user.schema';
import ErrorHandler from 'src/utils/ErrorHandler';

@Injectable()
export class ConversionFeeService {
  constructor(
    @InjectModel(ConversionFee.name)
    private readonly conversionFeeModel: Model<ConversionFeeDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAll(): Promise<ConversionFee[]> {
    return await this.conversionFeeModel.find().exec();
  }

  async createConversionFee(
    userId: ObjectId,
    conversionFeeData: CreateConversionFeeDTO,
  ): Promise<ConversionFee | any> {
    await this.checkAdminPermission(userId);

    const createdConversionFee =
      await this.conversionFeeModel.create(conversionFeeData);

    return { message: 'Successfully Created', createdConversionFee };
  }

  async updateConversionFee(
    userId: ObjectId,
    feeId: ObjectId,
    updateData: UpdateConversionFeeDTO,
  ): Promise<ConversionFee> {
    await this.checkAdminPermission(userId);

    const existingFee = await this.conversionFeeModel.findById(feeId).exec();

    if (!existingFee) {
      throw new Error('Conversion fee not found');
    }

    Object.assign(existingFee, updateData);
    const updatedFee = await existingFee.save();

    return updatedFee;
  }

  async deleteConversionFee(feeId: ObjectId, userId: ObjectId): Promise<any> {
    await this.checkAdminPermission(userId);
    console.log('This is ' + feeId);
    const conversionFee = await this.conversionFeeModel.findById(feeId).exec();

    if (!conversionFee) {
      throw new ErrorHandler('Failed to fetch updated conversion fee', 500);
    }

    const deletedDocument = await this.conversionFeeModel.findByIdAndDelete(
      conversionFee._id,
    );

    if (!deletedDocument) {
      throw new ErrorHandler('Conversion fee not found', 404);
    } else return { message: 'Successfully Deleted', success: true };
  }

  private async checkAdminPermission(userId: ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();

    if (!user || user.role !== 'superadmin') {
      throw new Error(
        'User not found or not authorized to manage conversion fees',
      );
    }
  }
}
