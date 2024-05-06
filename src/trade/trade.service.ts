// trade.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { Trade } from './trade.schema';
import { CreateTradeDTO } from './trade.dto';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel('Trade') private readonly tradeModel: Model<Trade>,
  ) {}

  async createTrade(userId: string, tradeData: CreateTradeDTO): Promise<Trade> {
    const trade = new this.tradeModel({
      userId,
      ...tradeData,
    });
    return await trade.save();
  }

  async findAll(): Promise<Trade[]> {
    return await this.tradeModel.find().exec();
  }

  async findByUserId(userId: ObjectId): Promise<Trade[]> {
    return await this.tradeModel.find({ userId }).exec();
  }

  async findAllExceptUser(userId: ObjectId): Promise<Trade[]> {
    return await this.tradeModel.find({ userId: { $ne: userId } }).exec();
  }
}
