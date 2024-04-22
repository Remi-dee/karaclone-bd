import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
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
