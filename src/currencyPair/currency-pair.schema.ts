import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { BaseSchema } from '../app.schema';

export type CurrencyPairDocument = HydratedDocument<CurrencyPair>;

@Schema({ timestamps: true })
export class CurrencyPair extends BaseSchema {
  @Prop({ required: true })
  base_currency: string;

  @Prop({ required: true })
  quote_currency: string;

  @Prop({ required: true, default: 0 })
  exchange_rate: number;
}

export const CurrencyPairSchema = SchemaFactory.createForClass(CurrencyPair);
