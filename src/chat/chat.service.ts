import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { User } from 'src/user/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createMessage(
    userId: Types.ObjectId,
    message: string,
    isSupport: boolean,
  ) {
    const user = await this.userModel.findById(userId).exec();
    console.log('message is', message);
    const newMessage = new this.chatModel({
      user,
      message,
      support: isSupport ? user : null,
    });
    return newMessage.save();
  }

  async getMessages(userId: Types.ObjectId) {
    console.log('this is user id', userId);
    const user = await this.userModel.findById(userId).exec();
    if (user.role === 'admin') {
      // If the user is an admin, they can see all messages
      return this.chatModel
        .find()
        .populate('user')
        .sort({ createdAt: 'asc' })
        .exec();
    } else {
      // If the user is not an admin, they only see their messages
      return this.chatModel
        .find({
          $or: [{ user: user._id }, { support: user._id }],
        })
        .populate('user support')
        .sort({ createdAt: 'asc' })
        .exec();
    }
  }
}
