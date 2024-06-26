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

  @Prop({ required: true })
  currency: string;

  @Prop({ required: false })
  swift_code: string;

  @Prop({ required: false })
  ach_routing: string;

  @Prop({ required: false })
  account_type: string;

  @Prop({ required: false })
  bank_address: string;
}

export const BeneficiarySchema = SchemaFactory.createForClass(Beneficiary);
