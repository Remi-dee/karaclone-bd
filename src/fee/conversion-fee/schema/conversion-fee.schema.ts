import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/app.schema';

export type ConversionFeeDocument = ConversionFee & Document;

@Schema({ timestamps: true })
export class ConversionFee extends BaseSchema {
  @Prop({ required: true })
  currency_pair: string;

  @Prop({ required: true })
  conversion_fee: string;
}

export const ConversionFeeSchema = SchemaFactory.createForClass(ConversionFee);
