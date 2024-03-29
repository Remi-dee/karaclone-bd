import { Injectable } from '@nestjs/common';
import { CurrencyPair, CurrencyPairDocument } from './currency-pair.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddCurrencyPairDTO,
  CurrencyPairListResponse,
  UpdateCurrencyPairDTO,
} from './currency-pair.dto';
import { ObjectId } from 'mongodb';
import { UserService } from '../user/user.service';
import ErrorHandler from '../utils/ErrorHandler';

@Injectable()
export class CurrencyPairService {
  constructor(
    @InjectModel(CurrencyPair.name)
    private readonly currencyPairModel: Model<CurrencyPairDocument>,
    private readonly userService: UserService,
  ) {}

  // add a currency pair
  async createCurrencyPairService(
    id: ObjectId,
    currencyPairDTO: AddCurrencyPairDTO,
  ): Promise<CurrencyPair | any> {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new ErrorHandler('User not found', 400);
    }

    if (user.role !== 'superadmin') {
      throw new ErrorHandler(
        'You are not authourized to perform this function!',
        404,
      );
    }

    const currencyPair = await this.currencyPairModel.create({
      ...currencyPairDTO,
    });

    return currencyPair;
  }

  // get a single currency pair
  async getCurrencyPairService(
    id: ObjectId,
  ): Promise<CurrencyPair | null | undefined> {
    const currencyPair = await this.currencyPairModel.findById(id);

    if (!currencyPair) {
      throw new ErrorHandler(
        'Error in fetching currency pair, please confirm the ID',
        404,
      );
    }

    return currencyPair;
  }

  async getAllCurrencyPairService(
    documentsToSkip = 0,
    limitOfDocuments?: number,
  ): Promise<CurrencyPairListResponse> {
    const [currencyPairs, count] = await Promise.all([
      this.currencyPairModel
        .find()
        .sort({ updatedAt: -1 })
        .skip(documentsToSkip)
        .limit(limitOfDocuments)
        .exec(),
      this.currencyPairModel.countDocuments(),
    ]);

    if (currencyPairs.length <= 0)
      throw new ErrorHandler('No currency pair is registered', 404);

    return { currencyPairs, count };
  }

  // update a currency pair
  async updateCurrencyPairService(
    id: ObjectId,
    updateCurrencyPairDTO: UpdateCurrencyPairDTO,
  ): Promise<CurrencyPair | undefined | any> {
    const { base_currency, quote_currency, exchange_rate } =
      updateCurrencyPairDTO;

    const currencyPair = await this.currencyPairModel.findById(id).exec();

    if (!currencyPair) {
      throw new ErrorHandler('Failed to fetch updated currency pair', 500);
    }

    const updatedCurrencyPair = await this.currencyPairModel.findByIdAndUpdate(
      currencyPair._id,
      {
        base_currency: base_currency,
        quote_currency: quote_currency,
        exchange_rate: exchange_rate,
      },
    );

    if (!updatedCurrencyPair) {
      throw new ErrorHandler('Currency pair not found', 404);
    }

    const updatedPair = await this.currencyPairModel
      .findById(currencyPair._id)
      .exec();

    return updatedPair;
  }

  // Delete a currency pair
  async deleteCurrencyPairService(id: ObjectId): Promise<void> {
    const currencyPair = await this.currencyPairModel.findById(id).exec();

    if (!currencyPair) {
      throw new ErrorHandler('Failed to fetch updated currency pair', 500);
    }

    const deletedDocument = await this.currencyPairModel.findByIdAndDelete(
      currencyPair._id,
    );

    if (!deletedDocument) {
      throw new ErrorHandler('Currency pair not found', 404);
    }
  }
}
