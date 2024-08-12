import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop({ required: false })
  address_line1: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zip: string;

  @Prop({ required: false })
  country_code: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

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
  sort_code: string;

  @Prop({ required: false })
  iban: string;

  @Prop({ required: false })
  date_of_birth: string;

  @Prop({ required: false })
  ach_routing: string;

  @Prop({ required: false })
  account_type: string;

  @Prop({ required: false })
  bank_address: string;

  @Prop({ required: true })
  beneficiary_id: string;

  @Prop({ type: AddressSchema, required: false })
  address: Address;
}

export const BeneficiarySchema = SchemaFactory.createForClass(Beneficiary);
