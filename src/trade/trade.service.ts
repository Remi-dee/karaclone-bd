import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { BuyTrade, Trade } from './trade.schema';
import { BuyTradeDTO, CreateTradeDTO } from './trade.dto';
import { Beneficiary } from './beneficiary.schema';
import { CreateBeneficiaryDTO } from './beneficiary.dto';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel('Trade') private readonly tradeModel: Model<Trade>,

    @InjectModel(Beneficiary.name)
    private readonly beneficiaryModel: Model<Beneficiary>,
    @InjectModel('BuyTrade') private readonly buyTradeModel: Model<BuyTrade>,
  ) {}

  async createTrade(userId: string, tradeData: CreateTradeDTO): Promise<Trade> {
    const tradeId = this.generateTradeId();
    const amount = Number(tradeData.amount);
    const sold = 0; // Initialize sold to 0
    const available_amount = amount - sold;
    const price = Math.round(tradeData.amount * tradeData.rate);

    const trade = new this.tradeModel({
      ...tradeData,
      tradeId,
      userId,
      sold,
      available_amount,
      price,
    });
    return await trade.save();
  }

  async deleteAllTrades(): Promise<{ deletedCount: number }> {
    const result = await this.tradeModel.deleteMany({}).exec();
    return { deletedCount: result.deletedCount };
  }

  async deleteTradeById(tradeId: string): Promise<Trade> {
    const trade = await this.tradeModel.findOneAndDelete({ tradeId }).exec();
    if (!trade) {
      throw new NotFoundException(`Trade with Trade ID ${tradeId} not found`);
    }
    return trade;
  }

  async deleteTradesByUserId(
    userId: string,
  ): Promise<{ deletedCount: number }> {
    const result = await this.tradeModel.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }

  async buyTrade(userId: string, buyTradeData: BuyTradeDTO): Promise<Trade> {
    const trade = await this.findTradeByTradeId(buyTradeData.tradeId);
    const amountToBuy = Number(buyTradeData.purchase);

    const price = Math.round(amountToBuy * trade.rate);

    if (isNaN(amountToBuy) || amountToBuy <= 0) {
      throw new BadRequestException('Invalid amount to buy');
    }

    if (amountToBuy > trade.available_amount) {
      throw new BadRequestException('Amount exceeds available trade amount');
    }

    const updatedTrade = await this.tradeModel.findOneAndUpdate(
      { tradeId: buyTradeData.tradeId },
      { $inc: { sold: amountToBuy, available_amount: -amountToBuy } },
      { new: true }, // Return the updated document
    );

    if (!updatedTrade) {
      throw new NotFoundException('Trade not found or update failed');
    }

    const buyTrade = new this.buyTradeModel({
      transaction_id: trade.tradeId,
      userId,
      purchase: amountToBuy,
      beneficiary_name: buyTradeData.beneficiary_name,
      beneficiary_account: buyTradeData.beneficiary_account,
      beneficiary_bank: buyTradeData.beneficiary_bank,
      payment_method: buyTradeData.payment_method,
      // Set the initial status
      price,
      rate: trade.rate,
    });

    await buyTrade.save();

    return updatedTrade;
  }

  async getAllBoughtTrades(): Promise<BuyTrade[]> {
    return this.buyTradeModel.find().exec();
  }

  async getBoughtTrade(id: string): Promise<BuyTrade> {
    const trade = await this.buyTradeModel.findById(id).exec();
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }
    return trade;
  }

  async getUserBoughtTrades(userId: string): Promise<BuyTrade[]> {
    return this.buyTradeModel.find({ userId }).exec();
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
  async createBeneficiary(
    userId: string,
    beneficiaryData: CreateBeneficiaryDTO,
  ): Promise<Beneficiary> {
    console.log('Beneficiary Data:', beneficiaryData);
    const beneficiary = new this.beneficiaryModel({
      ...beneficiaryData,
      userId,
    });
    return await beneficiary.save();
  }

  async getUserBeneficiaries(userId: string): Promise<Beneficiary[]> {
    return await this.beneficiaryModel.find({ userId }).exec();
  }

  async findBeneficiaryById(beneficiaryId: string): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryModel
      .findById(beneficiaryId)
      .exec();
    if (!beneficiary) {
      throw new NotFoundException(
        `Beneficiary with ID ${beneficiaryId} not found`,
      );
    }
    return beneficiary;
  }

  async deleteBeneficiaryById(
    beneficiaryId: string,
    userId: string,
  ): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryModel
      .findOneAndDelete({ _id: beneficiaryId, userId })
      .exec();
    if (!beneficiary) {
      throw new NotFoundException(
        `Beneficiary with ID ${beneficiaryId} not found`,
      );
    }
    return beneficiary;
  }

  async deleteAllBeneficiaries(
    userId: string,
  ): Promise<{ deletedCount: number }> {
    const result = await this.beneficiaryModel.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
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

  private generateTransactionId(): string {
    const prefix = 'TX-';
    const suffix = crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()
      .slice(0, 6);
    return `${prefix}${suffix}`;
  }
}
