import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/app.schema';

export type ConversionFeeDocument = ConversionFee & Document;

@Schema({ timestamps: true })
export class ConversionFee extends BaseSchema {
  @Prop({ required: true })
  transaction_type: string;

  @Prop({ required: true })
  user_type: string;

  @Prop({ required: true })
  minimum_amount: string;

  @Prop({ required: true })
  maximum_amount: string;

  @Prop({ required: true })
  currency_pair: string;

  @Prop({ required: true })
  transaction_fee: string;
}

export const ConversionFeeSchema = SchemaFactory.createForClass(ConversionFee);
