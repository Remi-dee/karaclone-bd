import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, } from 'mongoose';
import { BaseSchema } from 'src/app.schema';

export type TransactionFeeDocument = TransactionFee & Document;

@Schema({ timestamps: true })
export class TransactionFee extends BaseSchema {
  @Prop({ required: true })
  transaction_type: string;

  @Prop({ required: true })
  user_type: string;

  @Prop({ required: true })
  minimum_amount: string;

  @Prop({ required: true })
  maximummum_amount: string;

  @Prop({ required: true })
  currency_pair: string;

  @Prop({ required: true })
  transaction_fee: string;
}

export const TransactionFeeSchema =
  SchemaFactory.createForClass(TransactionFee);
