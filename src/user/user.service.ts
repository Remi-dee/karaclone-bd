import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUserDetails } from './user.dto';

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
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    if (email.includes('@'))
      return await this.userModel.findOne({ email: email });
  }
}
