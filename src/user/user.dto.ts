import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { E_USER_ROLE } from './user.enum';
import { REGEX, MESSAGES } from 'src/app.util';
import { User } from './user.schema';

export interface IUserDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: E_USER_ROLE;
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

export class RegisterUserDTO {
  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

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
