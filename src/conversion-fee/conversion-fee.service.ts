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
  ): Promise<ConversionFee> {
    await this.checkAdminPermission(userId);

    const createdConversionFee =
      await this.conversionFeeModel.create(conversionFeeData);

    return createdConversionFee;
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

  async deleteConversionFee(
    userId: ObjectId,
    feeId: ObjectId,
  ): Promise<boolean> {
    await this.checkAdminPermission(userId);

    const result = await this.conversionFeeModel
      .deleteOne({ _id: feeId })
      .exec();

    if (result.deletedCount !== 0) {
      return true;
    } else {
      throw new Error('Conversion fee not found');
    }
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
