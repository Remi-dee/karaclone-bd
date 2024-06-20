import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { ObjectId } from 'mongodb';

export type TradeDocument = HydratedDocument<Trade>;

@Schema({ timestamps: true })
export class Trade extends BaseSchema {
  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  exit_currency: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: string;

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

  @Prop({ default: 0 })
  sold: number;

  @Prop({ type: ObjectId, ref: 'User Id' })
  userId: ObjectId;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
