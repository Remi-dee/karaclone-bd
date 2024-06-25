import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { REGEX, MESSAGES } from '../app.util';
import { E_USER_ROLE, E_USER_TYPE } from '../user/user.enum';

export class IActivationToken {
  token: string;
  activationCode: string;
}

// activate user
export class IActivationRequest {
  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  activation_token: string;

  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  activation_code: string;
}

export class RegisterUserDTO {
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

  @ApiProperty({ description: 'Phone number of user' })
  @IsNotEmpty({ message: 'Phone number is required' })
  readonly phone: string;

  @ApiProperty({ description: 'Business name of user' })
  readonly business_name: string;

  @ApiProperty({ description: 'Business address of user' })
  readonly business_address: string;

  @ApiProperty({ description: 'Business email of user' })
  readonly business_email: string;

  @ApiProperty({ description: 'Business line of user' })
  readonly business_line: string;

  @ApiProperty({ description: 'Date of Birth' })
  readonly date_of_birth: string;

  @ApiProperty({ description: 'City of user' })
  readonly city: string;

  @ApiProperty({ description: 'state of user' })
  readonly state: string;

  @ApiProperty({ description: 'Zip of user' })
  readonly zip: string;

  @ApiProperty({ description: 'City of user' })
  readonly country_code: string;

  @ApiProperty({ description: 'User Password' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGES.PASSWORD_RULE_MESSAGE,
  })
  readonly password: string;
}

export class LoginUserDTO {
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
}
