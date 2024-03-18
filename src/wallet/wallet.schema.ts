import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { Transaction } from '../transaction/transaction.schema';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ timestamps: true })
export class Wallet extends BaseSchema {
  @Prop({ required: true })
  currency_code: string; 

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: false, default: 0 })
  escrow_balance: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
