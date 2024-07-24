import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches, IsString } from 'class-validator';
import { E_USER_ROLE, E_USER_TYPE } from './user.enum';
import { REGEX, MESSAGES } from '../app.util';
import { User } from './user.schema';

export interface IUserDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  account_type: E_USER_TYPE;
  role: E_USER_ROLE;
  business_name: string;
  business_address: string;
  business_email: string;
  business_line: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthenticationResponse {
  readonly accessToken: string;
  readonly user: IUserDetails;
}

export class ISignUpResponse {
  @ApiProperty({
    description: 'User object',
    example: {
      _id: 'sdjsd8fusdhfs',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      phone: '08131930335',
      emailVerifiedStatus: '0',
      role: 'superAdmin',
      isActive: '1',
      dateJoined: '22-01-22',
    },
  })
  readonly data: User;
  readonly token: string;
}

export class Verify2FADTO {
  @ApiProperty({ description: 'User one-time password' })
  @IsNotEmpty({ message: 'User one-time password is required' })
  readonly topt: string;
}

export class CreateUserDTO {
  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @ApiProperty({ description: 'Gender of user' })
  @IsNotEmpty({ message: 'Gender is required' })
  readonly gender: string;

  @ApiProperty({ description: 'Account type of user' })
  @IsNotEmpty({ message: 'Account type is required' })
  readonly account_type: E_USER_TYPE;

  @ApiProperty({ description: 'User role' })
  @IsNotEmpty({ message: 'User role is required' })
  readonly role: E_USER_ROLE;

  @ApiProperty({ description: 'Email of user' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'User Password' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGES.PASSWORD_RULE_MESSAGE,
  })
  readonly password: string;

  @ApiProperty({ description: 'ID Document' })
  @IsNotEmpty({ message: 'ID Document is required' })
  user_id_card: string;
}

// user.dto.ts
export class ForgotPasswordDTO {
  @ApiProperty({ description: 'Email of user' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ description: 'Token sent to user' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  resetToken: string;

  @ApiProperty({ description: 'New password of user' })
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}

export class UpdateUserDTO {
  @ApiProperty({ description: 'Name of user', required: false })
  name: string;

  @ApiProperty({ description: 'Gender of user', required: false })
  readonly gender: string;

  @ApiProperty({ description: 'Email of user', required: false })
  // @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Phone number of user', required: false })
  readonly phone: string;

  @ApiProperty({ description: 'User ID document', required: false })
  user_id_card: string;

  @ApiProperty({ description: 'Business name of user', required: false })
  readonly business_name: string;

  @ApiProperty({ description: 'Business address of user', required: false })
  readonly business_address: string;

  @ApiProperty({ description: 'Business email of user', required: false })
  readonly business_email: string;

  @ApiProperty({ description: 'Business line of user', required: false })
  readonly business_line: string;

  @ApiProperty({ description: 'Date of birth of user', required: false })
  readonly date_of_birth: string;

  @ApiProperty({ description: 'City of user', required: false })
  readonly city: string;

  @ApiProperty({ description: 'State of user', required: false })
  readonly state: string;

  @ApiProperty({ description: 'Zip code of user', required: false })
  readonly zip: string;

  @ApiProperty({ description: 'Country code of user', required: false })
  readonly country_code: string;
}
