import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { Transaction } from '../transaction/transaction.schema';
import { Type } from 'class-transformer';
import { User } from '../user/user.schema';
import { ObjectId } from 'mongodb';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ timestamps: true })
export class Wallet extends BaseSchema {
  @Prop({ required: true })
  currency_code: string;

  @Prop({ required: false, default: 0 })
  balance: number;

  @Prop({ required: false, default: 0 })
  escrow_balance: number;

  @Prop({ type: ObjectId, ref: 'User' })
  @Type(() => User)
  user: User;

  @Prop({ type: [{ type: ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
