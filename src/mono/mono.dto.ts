import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateMonoUserDTO {
  @ApiProperty({
    description: 'The ID of the user',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The Mono ID returned after authentication',
    example: 'mono_id_123456',
  })
  @IsString()
  monoId: string;

  @ApiProperty({
    description: 'The Mono authentication code',
    example: 'auth_code_123456',
  })
  @IsString()
  monoCode: string;

  @ApiProperty({
    description: 'The status of the Mono authentication',
    example: false,
  })
  @IsBoolean()
  monoStatus: boolean;
}

export class UpdateMonoUserDTO {
  @ApiProperty({
    description: 'The Mono ID returned after authentication',
    example: 'mono_id_123456',
  })
  @IsString()
  @IsOptional()
  monoId?: string;

  @ApiProperty({
    description: 'The Mono authentication code',
    example: 'auth_code_123456',
  })
  @IsString()
  @IsOptional()
  monoCode?: string;

  @ApiProperty({
    description: 'The status of the Mono authentication',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  monoStatus?: boolean;

  @ApiProperty({
    description: 'The reauthentication token for Mono',
    example: 'reauth_token_123456',
  })
  @IsString()
  @IsOptional()
  monoReauthToken?: string;
}



export class InitiateAccountDTO {
  @ApiProperty({
    description: 'Customer details',
    example: {
      name: 'Samuel Olamide',
      email: 'samuel.nomo@mono.co',
    },
  })
  @IsObject()
  customer: {
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Meta information',
    example: { ref: '99008877TEST' },
  })
  @IsObject()
  meta: {
    ref: string;
  };

  @ApiProperty({
    description: 'Scope of the request',
    example: 'auth',
  })
  @IsString()
  scope: string;

  @ApiProperty({
    description: 'Redirect URL after completion',
    example: 'https://mono.co',
  })
  @IsString()
  redirect_url: string;
}

export class AuthenticateAccountDTO {
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}

class CustomerDetailsDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsObject()
  @IsNotEmpty()
  identity: {
    type: string;
    number: string;
  };

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class InitiatePaymentDTO {
  @ApiProperty({
    description:
      'Payment amount in the smallest currency unit (e.g., kobo for NGN)',
    example: 20000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Payment type',
    example: 'onetime-debit',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'account',
  })
  @IsString()
  method: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'testing',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Unique payment reference',
    example: 'testing-10039819098',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Redirect URL after payment',
    example: 'https://mono.co',
  })
  @IsString()
  redirect_url: string;

  @ApiProperty({
    description: 'Customer details',
    example: {
      email: 'samuel.olamide@mono.co',
      phone: '08122334455',
      address: 'home address',
      identity: {
        type: 'bvn',
        number: '22110033445',
      },
      name: 'Samuel Olamide',
    },
  })
  @IsObject()
  customer: CustomerDetailsDTO;

  @ApiProperty({
    description: 'Additional metadata',
    example: {},
  })
  @IsObject()
  meta: object;
}
