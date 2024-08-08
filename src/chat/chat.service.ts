import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { User } from 'src/user/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createMessage(
    userId: Types.ObjectId,
    message: string,
    isSupport: boolean = false,
    conversationId?: string,
  ) {
    const user = await this.userModel.findById(userId).exec();

    // Generate or validate the conversationId
    if (!conversationId) {
      conversationId = user.conversationId || uuidv4();
      user.conversationId = conversationId;
      await user.save();
    }

    const newMessage = new this.chatModel({
      user: isSupport ? null : user._id,
      message,
      support: isSupport ? user._id : null,
      conversationId,
    });

    await newMessage.save();

    return { newMessage, conversationId };
  }

  async getAllConversations() {
    // Step 1: Aggregate to get distinct user and conversationId pairs
    const conversationPairs = await this.chatModel
      .aggregate([
        {
          $group: {
            _id: {
              user: '$user',
              conversationId: '$conversationId',
            },
          },
        },
      ])
      .exec();

    // Step 2: Extract user IDs from conversation pairs
    const userIds = conversationPairs
      .map((pair) => pair._id.user)
      .filter((userId) => userId); // Filter out null or undefined userIds

    // Step 3: Fetch user details based on extracted user IDs
    const users = await this.userModel.find({ _id: { $in: userIds } }).exec();

    // Step 4: Create a map of user details for quick lookup
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Step 5: Filter conversations and exclude those with null user values
    const conversationsWithUsers = conversationPairs
      .map((pair) => ({
        user: userMap.get(pair._id.user?.toString()), // Get user details or undefined if not found
        conversationId: pair._id.conversationId,
      }))
      .filter((conversation) => conversation.user); // Exclude conversations with null user

    return { conversationsWithUsers };
  }

  async getMessages(userId: Types.ObjectId, conversationId?: any) {
    const user = await this.userModel.findById(userId).exec();

    // If the conversationId is provided and the user is an admin, fetch messages for that conversation
    if (user.role === 'admin' && conversationId) {
      return this.chatModel
        .find({ conversationId })
        .populate('user support')
        .sort({ createdAt: 'asc' })
        .exec();
    }

    // If no conversationId is provided, fetch messages for the user's conversation
    const userConversationId = user.conversationId;
    if (!userConversationId) {
      return [];
    }

    return this.chatModel
      .find({
        conversationId: userConversationId,
        $or: [{ user: user._id }, { support: { $ne: null } }],
      })
      .populate('user support')
      .sort({ createdAt: 'asc' })
      .exec();
  }

  async getMessagesByConversationId(conversationId: string) {
    return this.chatModel
      .find({ conversationId })
      .populate('user support')
      .sort({ createdAt: 'asc' })
      .exec();
  }

  async deleteAllMessages() {
    return this.chatModel.deleteMany({}).exec();
  }

  async deleteUserMessages(userId: Types.ObjectId) {
    const user = await this.userModel.findById(userId).exec();
    const conversationId = user.conversationId;

    if (!conversationId) {
      return { deletedCount: 0 };
    }

    return this.chatModel.deleteMany({ conversationId }).exec();
  }
}
