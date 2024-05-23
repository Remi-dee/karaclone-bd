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

  @Prop({ required: true })
  bank_name: string;

  @Prop({ required: true })
  account_number: string;

  @Prop({ required: true })
  beneficiary_name: string;

  @Prop({ required: true })
  beneficiary_account: string;

  @Prop({ required: true, unique: true })
  tradeId: string;

  @Prop({ type: ObjectId, ref: 'User Id' })
  userId: ObjectId;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
