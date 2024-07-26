import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  CreateUserDTO,
  IUserDetails,
  UpdateUserDTO,
  Verify2FADTO,
} from './user.dto';
import { ObjectId } from 'mongodb';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { generateKey } from '../app.util';
import ErrorHandler from '../utils/ErrorHandler';
import { v4 as uuidv4 } from 'uuid';
import * as cloudinary from 'cloudinary';
import { EmailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private mailService: EmailService,
  ) {}

  // Define upload function
  async uploadDocumentToCloudinary(
    document: string,
  ): Promise<{ public_id: string; url: string }> {
    const uniquePublicId = uuidv4(); // Generate unique public ID

    const uploadResult = await cloudinary.v2.uploader.upload(document, {
      public_id: uniquePublicId,
      folder: 'user_documents',
      width: 150,
    });

    return {
      public_id: uploadResult.public_id,
      url: uploadResult.url,
    };
  }

  async createUserService(createUserDto: CreateUserDTO): Promise<User> {
    const { name, email, gender, role, user_id_card, password, account_type } =
      createUserDto;

    let uploadedDocument;
    if (user_id_card) {
      uploadedDocument = await this.uploadDocumentToCloudinary(user_id_card);
    }

    const newUser = new this.userModel({
      name,
      email,
      gender,
      role,
      user_id_card: uploadedDocument,
      password,
      account_type,
    });

    const data = { user: { name: newUser.name, password: newUser.password } };

    try {
      this.mailService.sendMail({
        email: newUser.email,
        subject: 'Welcome Email',
        template: 'welcome-mail',
        context: data,
      });

      return await newUser.save();
    } catch (error: any) {
      throw new ErrorHandler(error.message, 400);
    }
  }

  async generatePasswordService(): Promise<string> {
    // Generate random user password
    const generatedPassword = generateKey(6);
    if (!generatedPassword)
      throw new ErrorHandler('Error occurred in generating user password', 400);
    return generatedPassword;
  }

  getUserDetails(user: UserDocument): IUserDetails {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      account_type: user.account_type,
      role: user.role,
      business_address: user.business_address,
      business_email: user.business_email,
      business_name: user.business_name,
      business_line: user.business_line,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    if (email && email.includes('@')) {
      // Add a check for email existence
      return await this.userModel.findOne({ email: email });
    }
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

  async updateUserProfile(
    userId: ObjectId,
    updateUserDto: UpdateUserDTO,
  ): Promise<User> {
    console.log('User ID:', userId);
    console.log('Update DTO:', updateUserDto);

    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: userId }, // Use criteria to find the user by ID
        { $set: updateUserDto },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new ErrorHandler('User not found', 404);
      }

      console.log('Updated User:', updatedUser);
      return updatedUser; // No need to call .save() again, findOneAndUpdate already returns the updated document
    } catch (error) {
      console.error('Error updating user:', error);
      throw new ErrorHandler('Failed to update user profile', 500);
    }
  }

  async enableTwoFA(userId): Promise<void> {
    console.log('our user id 2 is', userId);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }
    user.isTwoFactorEnabled = true;
    await user.save();
  }

  async disableTwoFA( userId ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }
    user.isTwoFactorEnabled = false;
    await user.save();
  }
}
