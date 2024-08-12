import * as crypto from 'crypto';
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { randomUUID } from 'crypto';
import { WithdrawalRequestDTO } from 'src/truelayer/truelayer.dto';
import { TrueLayerService } from 'src/truelayer/truelayer.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel('Trade') private readonly tradeModel: Model<Trade>,

    @InjectModel(Beneficiary.name)
    private readonly beneficiaryModel: Model<Beneficiary>,

    @InjectModel('BuyTrade') private readonly buyTradeModel: Model<BuyTrade>,

    private userTransactionsService: UserTransactionsService,

    private trueLayerService: TrueLayerService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,

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
      if (tradeData.payment_method === 'Wallet') {
        const amountToDeduct = tradeData.amount;
        await this.walletService.deductWallet(
          userId,
          amountToDeduct,
          tradeData.currency,
          session,
        );
      }

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

      if (buyTradeData.payment_method === 'Wallet') {
        await this.walletService.deductWallet(
          userId,
          price,
          buyTradeData.paid_currency,
          session,
        );
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
        beneficiary_id: buyTradeData.beneficiary_id,
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

      // // Check if the trade is completely sold out
      // if (updatedTrade.available_amount === 0) {
      //   await this.payoutBeneficiary(updatedTrade.trade_id);
      // }

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

    const beneficiary_id = randomUUID();
    const beneficiary = new this.beneficiaryModel({
      ...beneficiaryData,
      userId,
      beneficiary_id,
    });
    return await beneficiary.save();
  }

  async getUserBeneficiaries(userId: string): Promise<Beneficiary[]> {
    return await this.beneficiaryModel.find({ userId }).exec();
  }

  async findBeneficiaryById(beneficiaryId: string): Promise<Beneficiary> {
    const beneficiary = await this.beneficiaryModel
      .findOne({ beneficiary_id: beneficiaryId })
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
      await this.buyTradeModel.collection.dropIndex('beneficiary_id');
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

  async payoutBeneficiary(tradeId: string): Promise<any> {
    const trade = await this.tradeModel.findById(tradeId).exec();
    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    const beneficiary = await this.findBeneficiaryById(trade.beneficiary_id);
    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    const withdrawalRequest: WithdrawalRequestDTO = {
      beneficiary: {
        type: 'external_account',
        account_holder_name: beneficiary.name,
        account_identifier: {
          type: 'sort_code_account_number',
          sort_code: beneficiary.sort_code,
          account_number: beneficiary.account,
        },
      },
      address: {
        address_line1: beneficiary.address.address_line1,
        zip: beneficiary.address.zip,
        city: beneficiary.address.city,
        state: beneficiary.address.state,
        country_code: beneficiary.address.country_code,
      },
      currency: beneficiary.currency,
      amount_in_minor: trade.amount,
      reference: `Trade payout for ${tradeId}`,
      date_of_birth: beneficiary.date_of_birth,
    };

    try {
      const response =
        await this.trueLayerService.initiateWithdrawal(withdrawalRequest);
      return response;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'An error occurred during the payout process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async completeTrade(tradeId: string, buyerId: string): Promise<any> {
  //   const trade = await this.tradeRepository.findOne(tradeId);

  //   if (!trade) {
  //     throw new NotFoundException('Trade not found');
  //   }

  //   if (trade.status !== 'AVAILABLE') {
  //     throw new BadRequestException('Trade is not available for completion');
  //   }

  //   trade.status = 'BOUGHT';
  //   trade.buyerId = buyerId;
  //   await this.buyradeModel.save(trade);

  //   // Retrieve beneficiary details using beneficiaryId
  //   const beneficiary = await this.userService.getBeneficiary(
  //     trade.beneficiaryId,
  //   );

  //   if (!beneficiary) {
  //     throw new NotFoundException('Beneficiary not found');
  //   }

  //   // Create withdrawal request
  //   const withdrawalRequest: WithdrawalRequestDTO = {
  //     beneficiary: {
  //       name: beneficiary.name,
  //       account_number: beneficiary.accountNumber,
  //       bank_code: beneficiary.bankCode,
  //       bank_name: beneficiary.bankName,
  //     },
  //     address: {
  //       line1: beneficiary.addressLine1,
  //       city: beneficiary.city,
  //       country_code: beneficiary.countryCode,
  //       postal_code: beneficiary.postalCode,
  //     },
  //     currency: trade.currency,
  //     amount_in_minor: trade.amountInMinor,
  //     reference: `Trade ${trade.id} Payout`,
  //     date_of_birth: beneficiary.dateOfBirth,
  //   };

  //   // Initiate withdrawal
  //   await this.trueLayerService.initiateWithdrawal(withdrawalRequest);
  // }
}
