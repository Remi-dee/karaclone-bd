import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { ObjectId } from 'mongodb';

export type TradeDocument = HydratedDocument<Trade>;
export type BuyTradeDocument = HydratedDocument<BuyTrade>;

@Schema({ timestamps: true })
export class Trade extends BaseSchema {
  save(): Trade | PromiseLike<Trade> {
    throw new Error('Method not implemented.');
  }
  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  exit_currency: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  minimumBid: string;

  @Prop({ required: false })
  account_name: string;

  @Prop({ required: false })
  bank_name: string;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  transaction_fee: string;

  @Prop({ required: true })
  vat_fee: string;

  @Prop({ required: false })
  account_number: string;

  @Prop({ required: false })
  additional_information?: string;

  @Prop({ required: true, unique: true })
  tradeId: string;

  @Prop({ required: true, unique: true })
  readonly beneficiary_name: string;

  @Prop({ required: true, unique: true })
  readonly beneficiary_account: string;

  @Prop({ required: true, unique: true })
  readonly beneficiary_bank: string;

  @Prop({ required: true })
  available_amount: number;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ type: ObjectId, ref: 'User Id' })
  userId: ObjectId;

  @Prop({ required: true }) // Add the price property
  price: number;
}

@Schema({ timestamps: true })
export class BuyTrade extends Document {
  @Prop({ required: true })
  transaction_id: string;

  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  purchase: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  beneficiary_name: string;

  @Prop({ required: true })
  beneficiary_account: string;

  @Prop({ required: true })
  beneficiary_bank: string;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ required: true })
  status: string; // e.g., 'completed', 'pending', etc.

  @Prop({ required: false })
  account_name: string;

  @Prop({ required: false })
  bank_name: string;

  @Prop({ required: false })
  account_number: string;

  @Prop({ required: false })
  purchase_currency: string;
  
  @Prop({ required: false })
  paid_currency: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
export const BuyTradeSchema = SchemaFactory.createForClass(BuyTrade);
