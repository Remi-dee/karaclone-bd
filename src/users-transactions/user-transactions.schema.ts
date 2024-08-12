// transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type UserTransactionDocument = UserTransaction & Document;

@Schema({ timestamps: true })
export class UserTransaction {
  @Prop({ required: false })
  user_transactionId: string;

  @Prop({ required: false })
  date: Date;

  @Prop({ required: false })
  transaction_type: string;

  @Prop({ required: false })
  bank_name: string;

  @Prop({ required: false })
  account_name: string;

  @Prop({ required: false })
  transaction_fee: number;

  @Prop({ required: false })
  status: string;

  @Prop({ required: false })
  payment_method: string;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false })
  readonly beneficiary_name: string;

  @Prop({ required: false })
  readonly beneficiary_account: number;

  @Prop({ required: false })
  readonly beneficiary_bank: string;

  @Prop({ required: false })
  available_amount: number;

  @Prop({ type: ObjectId, ref: 'User Id' })
  user_id: ObjectId;

  @Prop({ required: false })
  amount_exchanged: string;

  @Prop({ required: false })
  amount_reversed: string;

  @Prop({ required: false })
  amount_deposited: string;

  @Prop({ required: false })
  amount_sold: string;
  @Prop({ required: false })
  amount_received: string;
  @Prop({ required: false })
  rate: string;
}

export const UserTransactionSchema =
  SchemaFactory.createForClass(UserTransaction);
