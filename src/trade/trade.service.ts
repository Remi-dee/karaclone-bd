import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId, Connection } from 'mongoose';

import { BuyTrade, Trade } from './trade.schema';
import { BuyTradeDTO, CreateTradeDTO } from './trade.dto';
import { Beneficiary } from './beneficiary.schema';
import { CreateBeneficiaryDTO } from './beneficiary.dto';
import { UserTransactionsService } from 'src/users-transactions/user-transactions.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel('Trade') private readonly tradeModel: Model<Trade>,

    @InjectModel(Beneficiary.name)
    private readonly beneficiaryModel: Model<Beneficiary>,

    @InjectModel('BuyTrade') private readonly buyTradeModel: Model<BuyTrade>,

    private userTransactionsService: UserTransactionsService,

    private notificationService: NotificationService,

    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createTrade(
    userId: Types.ObjectId,
    tradeData: CreateTradeDTO,
  ): Promise<Trade> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const tradeId = this.generateTradeId();
      const amount = Number(tradeData.amount);
      const sold = 0; // Initialize sold to 0
      const available_amount = amount - sold;
      const price = Math.round(tradeData.amount * tradeData.rate);

      const trade = new this.tradeModel({
        ...tradeData,
        trade_id: tradeId,
        user_id: userId,
        sold,
        available_amount,
        price,
      });

      const createdTrade = await trade.save({ session });

      const transactionData = {
        user_transactionId: tradeId,
        date: new Date().toString(),
        transaction_type: 'Trade',
        bank_name: tradeData.bank_name,
        account_name: tradeData.account_name,
        transaction_fee: tradeData.transaction_fee,
        status: tradeData.status,
        payment_method: tradeData.payment_method,
        beneficiary_name: tradeData.beneficiary_name,
        beneficiary_account: tradeData.beneficiary_account,
        beneficiary_bank: tradeData.beneficiary_bank,
        currency: tradeData.currency,
        user_id: userId,
        amount_exchanged: '',
        amount_received: (
          tradeData.amount - tradeData.transaction_fee
        ).toString(),
        amount_reversed: '',
        amount_deposited: '',
        amount_sold: sold.toString(),
        rate: tradeData.rate.toString(),
      };

      const transaction =
        await this.userTransactionsService.create(transactionData);
      console.log('transaction is', transaction);

      await this.notificationService.createNotification(
        userId.toString(),
        `Trade created with ID: ${tradeId}`,
        'trade',
      );

      await session.commitTransaction();
      return createdTrade;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

  async buyTrade(
    userId: Types.ObjectId,
    buyTradeData: BuyTradeDTO,
  ): Promise<Trade> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const trade = await this.findTradeByTradeId(buyTradeData.trade_id);
      const amountToBuy = Number(buyTradeData.purchase);
      const price = Math.round(amountToBuy * trade.rate);

      if (isNaN(amountToBuy) || amountToBuy <= 0) {
        throw new BadRequestException('Invalid amount to buy');
      }

      if (amountToBuy > trade.available_amount) {
        throw new BadRequestException('Amount exceeds available trade amount');
      }

      const updatedTrade = await this.tradeModel.findOneAndUpdate(
        { trade_id: buyTradeData.trade_id },
        { $inc: { sold: amountToBuy, available_amount: -amountToBuy } },
        { new: true, session },
      );

      if (!updatedTrade) {
        throw new NotFoundException('Trade not found or update failed');
      }

      const buyTrade = new this.buyTradeModel({
        transaction_id: trade.trade_id,
        user_id: userId,
        purchase: amountToBuy,
        beneficiary_name: buyTradeData.beneficiary_name,
        beneficiary_account: buyTradeData.beneficiary_account,
        beneficiary_bank: buyTradeData.beneficiary_bank,
        payment_method: buyTradeData.payment_method,
        price,
        rate: trade.rate,
        status: buyTradeData.status,
      });

      await buyTrade.save({ session });

      const transactionData = {
        user_transactionId: trade.trade_id,
        date: new Date().toLocaleString(),
        transaction_type: 'Trade',
        bank_name: buyTradeData.bank_name,
        account_name: buyTradeData.account_name,
        transaction_fee: buyTradeData.transaction_fee,
        status: buyTradeData.status,
        payment_method: buyTradeData.payment_method,
        beneficiary_name: buyTradeData.beneficiary_name,
        beneficiary_account: buyTradeData.beneficiary_account,
        beneficiary_bank: buyTradeData.beneficiary_bank,
        currency: buyTradeData.purchase_currency,
        user_id: userId,
        amount_exchanged: price.toString(),
        amount_received: (
          amountToBuy - buyTradeData.transaction_fee
        ).toString(),
        amount_reversed: '',
        amount_deposited: '',
        amount_sold: '',
        rate: buyTradeData.rate,
      };

      const transaction =
        await this.userTransactionsService.create(transactionData);
      console.log('transaction is', transaction);

      await this.notificationService.createNotification(
        userId.toString(),
        `Trade bought with ID: ${trade.trade_id}`,
        'trade',
      );

      await session.commitTransaction();
      return updatedTrade;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

  async findByUserId(user_id: ObjectId): Promise<Trade[]> {
    return await this.tradeModel.find({ user_id }).exec();
  }

  async findAllExceptUser(user_id: ObjectId): Promise<Trade[]> {
    return await this.tradeModel.find({ user_id: { $ne: user_id } }).exec();
  }

  async findTradeByTradeId(trade_id: string): Promise<Trade> {
    const trade = await this.tradeModel.findOne({ trade_id }).exec();
    if (!trade) {
      throw new NotFoundException(`Trade with Trade ID ${trade_id} not found`);
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

  generateTradeId(): string {
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

  async dropTradeIdIndex(): Promise<void> {
    try {
      await this.tradeModel.collection.dropIndex('tradeId_1');
      console.log('tradeId_1 index dropped successfully');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('tradeId_1 index does not exist');
      } else {
        console.error('Error dropping tradeId_1 index:', error);
      }
    }
  }

  async dropIndexes(): Promise<void> {
    const indexes = await this.tradeModel.collection.indexes();
    console.log('Existing indexes:', indexes);

    try {
      await this.tradeModel.collection.dropIndex('tradeId_1');
      console.log('tradeId_1 index dropped successfully');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('tradeId_1 index does not exist');
      } else {
        console.error('Error dropping tradeId_1 index:', error);
      }
    }

    try {
      await this.tradeModel.collection.dropIndex('beneficiary_name_1');
      console.log('beneficiary_name_1 index dropped successfully');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('beneficiary_name_1 index does not exist');
      } else {
        console.error('Error dropping beneficiary_name_1 index:', error);
      }
    }

    try {
      await this.tradeModel.collection.dropIndex('beneficiary_account_1');
      console.log('beneficiary_account_1 index dropped successfully');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('beneficiary_account_1 index does not exist');
      } else {
        console.error('Error dropping beneficiary_account_1 index:', error);
      }
    }
  }

  async listIndexes(): Promise<void> {
    const indexes = await this.tradeModel.collection.indexes();
    console.log('Indexes:', indexes);
  }
}
