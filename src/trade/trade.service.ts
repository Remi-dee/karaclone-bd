import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const tradeId = this.generateTradeId();
    const trade = new this.tradeModel({
      ...tradeData,
      tradeId,
      userId,
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

  async findTradeByTradeId(tradeId: string): Promise<Trade> {
    const trade = await this.tradeModel.findOne({ tradeId }).exec();
    if (!trade) {
      throw new NotFoundException(`Trade with Trade ID ${tradeId} not found`);
    }
    return trade;
  }

  private generateTradeId(): string {
    const prefix = 'FXK-';
    const suffix = crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()
      .slice(0, 6);
    return `${prefix}${suffix}`;
  }
}
