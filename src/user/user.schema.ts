import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { E_USER_ROLE, E_USER_TYPE } from './user.enum';
import { Wallet } from '../wallet/wallet.schema';
import { ObjectId } from 'mongodb';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @ApiProperty({ example: 'John Doe', description: 'Full name of user' })
  @Prop({ required: false })
  name: string;

  @ApiProperty({ example: 'john.doe@gmail.com', description: 'Email of user' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: '+2349147859834',
    description: 'Phone number of user',
  })
  @Prop({ required: false })
  phone: string;

  @ApiProperty({ example: 'user', description: 'Role of user' })
  @Prop({ required: true, default: E_USER_ROLE.USER })
  role: E_USER_ROLE;

  @ApiProperty({ example: 'Individual', description: 'User account type' })
  @Prop({ default: E_USER_TYPE.INDIVIDUAL })
  account_type: E_USER_TYPE;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  secret: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  business_name: string;

  @Prop({ required: false })
  business_address: string;

  @Prop({ required: false })
  business_email: string;

  @Prop({ required: false })
  business_line: string;

  @Prop({ required: false, type: Object })
  user_id_card: {
    public_id: string;
    url: string;
  };

  @Prop({ required: true })
  public_key: string;

  @Prop({ required: true })
  secret_key: string;

  @ApiProperty({
    example: 'true',
    description: 'If User account has been verified',
  })
  @Prop({ default: false })
  is_verified: boolean;

  @ApiProperty({
    example: 'true',
    description: 'If User account has been verified',
  })
  @Prop({ default: false })
  is_2FA_enabled: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Completed user kyc',
  })
  @Prop({ default: false })
  is_completed_kyc: boolean;

  @Prop({ type: [{ type: ObjectId, ref: 'Wallet' }] })
  wallets: Wallet[];

  @Prop({ required: false })
  resetPasswordToken: string;

  @Prop({ required: false })
  resetPasswordExpires: Date;
  @Prop({ type: ObjectId, ref: 'KYC' })
  kyc: string;

  @Prop({ required: false })
  date_of_birth: string;

  @Prop({ required: false })
  city: string;

  @Prop({ required: false })
  state: string;

  @Prop({ required: false })
  zip: string;

  @Prop({ required: false })
  country_code: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
