import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './../app.schema';
import { E_USER_ROLE } from './user.enum';

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

  @ApiProperty({ example: 'admin', description: 'Role of user' })
  @Prop({ default: E_USER_ROLE.user })
  role: E_USER_ROLE;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  secret: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});
