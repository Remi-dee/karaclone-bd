import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUserDetails, Verify2FADTO } from './user.dto';
import { ObjectId } from 'mongodb';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  getUserDetails(user: UserDocument): IUserDetails {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      account_type: user.account_type,
      business_address: user.business_address,
      business_email: user.business_email,
      business_name: user.business_name,
      business_line: user.business_line,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    if (email.includes('@'))
      return await this.userModel.findOne({ email: email });
  }

  async findOneById(id: ObjectId): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async generateQrCode(data: string, id: ObjectId): Promise<string> {
    try {
      const qrCode = await qrcode.toDataURL(data);

      const updateUser = await this.userModel.findByIdAndUpdate(id, {
        is_2FA_enabled: true,
      });
      updateUser.save();
      return qrCode;
    } catch (error) {
      throw new Error('Error generating QR code');
    }
  }

  async verifyTOTP(
    userSecret: string,
    userTOTP: Verify2FADTO,
  ): Promise<boolean> {
    try {
      // Generate a TOTP code based on the user's secret
      const verified = speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: userTOTP.topt,
      });

      // Return whether the TOTP provided by the user matches the generated one
      return verified;
    } catch (error) {
      throw new Error('Error verifying TOTP');
    }
  }
}
