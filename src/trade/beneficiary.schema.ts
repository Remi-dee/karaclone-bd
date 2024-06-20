import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Beneficiary extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  bank_name: string;
}

export const BeneficiarySchema = SchemaFactory.createForClass(Beneficiary);
