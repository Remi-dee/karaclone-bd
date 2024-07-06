// userTransactionss.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserTransaction,
  UserTransactionDocument,
} from './user-transactions.schema';
import {
  CreateUserTransactionDto,
  UpdateUserTransactionDto,
} from './user-transactions.dto';

@Injectable()
export class UserTransactionsService {
  constructor(
    @InjectModel(UserTransaction.name)
    private userTransactionsModel: Model<UserTransactionDocument>,
  ) {}

  async create(
    createUserTransactionsDto: CreateUserTransactionDto,
  ): Promise<UserTransaction> {
    const createdUserTransactions = new this.userTransactionsModel(
      createUserTransactionsDto,
    );
    return createdUserTransactions.save();
  }

  async findAll(): Promise<UserTransaction[]> {
    const transactions = await this.userTransactionsModel.find().exec();
    return transactions.map((transaction) => this.formatDate(transaction));
  }

  async findOne(id: string): Promise<UserTransaction> {
    const transaction = await this.userTransactionsModel.findById(id).exec();
    return this.formatDate(transaction);
  }

  async update(
    id: string,
    updateUserTransactionsDto: UpdateUserTransactionDto,
  ): Promise<UserTransaction> {
    return this.userTransactionsModel
      .findByIdAndUpdate(id, updateUserTransactionsDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserTransaction> {
    const transaction = await this.userTransactionsModel
      .findByIdAndDelete(id)
      .exec();
    return this.formatDate(transaction);
  }

  private formatDate(transaction: UserTransactionDocument): UserTransaction {
    const formattedTransaction = transaction.toObject();
    formattedTransaction.date = this.formatDateString(transaction.date);
    return formattedTransaction;
  }

  private formatDateString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(date).toLocaleString('en-US', options);
  }

  async dropBeneficiaryAccountIndex(): Promise<void> {
    await this.userTransactionsModel.collection.dropIndex('beneficiary_account_1');
  }
}
