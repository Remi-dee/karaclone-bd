import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends BaseSchema {
  @Prop({ required: true })
  type: string; 

  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: false })
  description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
