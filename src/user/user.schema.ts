import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { E_USER_TYPE } from './user.enum';
import { Wallet } from 'src/wallet/wallet.schema';

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

  @ApiProperty({ example: 'Individual', description: 'Role of user' })
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
  cac_document: {
    public_id: string,
    url: string,
  }

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

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Wallet' }] })
  wallets: Wallet[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
