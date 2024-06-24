import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProviderSelection {
  @ApiProperty({
    description: 'The type of provider selection',
    example: 'user_selected',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

class Filter {
  @ApiProperty({
    description: 'List of countries to filter providers by',
    example: ['GB'],
  })
  @IsString({ each: true })
  countries: string[];
}

class Beneficiary {
  @ApiProperty({
    description: 'The type of beneficiary',
    example: 'merchant_account',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'The ID of the merchant account',
    example: '30c00b14-a161-4496-85d3-aa0d99015eaa',
  })
  @IsString()
  @IsNotEmpty()
  merchant_account_id: string;

  @ApiProperty({
    description: 'The reference for the payment',
    example: 'fedeTest 123 1',
  })
  @IsString()
  @IsOptional()
  reference: string;
}

class PaymentMethod {
  @ApiProperty({
    description: 'Provider selection details',
  })
  @ValidateNested()
  @Type(() => ProviderSelection)
  provider_selection: ProviderSelection;

  @ApiProperty({
    description: 'Filter details',
  })
  @ValidateNested()
  @Type(() => Filter)
  filter: Filter;

  @ApiProperty({
    description: 'The type of payment method',
    example: 'bank_transfer',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Beneficiary details',
  })
  @ValidateNested()
  @Type(() => Beneficiary)
  beneficiary: Beneficiary;
}

class Address {
  @ApiProperty({
    description: 'The first line of the address',
    example: '40 Finsbury Square',
  })
  @IsString()
  address_line1: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'London',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'London',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'The zip code of the address',
    example: 'EC2A 1PX',
  })
  @IsString()
  zip: string;

  @ApiProperty({
    description: 'The country code of the address',
    example: 'GB',
  })
  @IsString()
  country_code: string;
}

class UserDetails {
  @ApiProperty({
    description: 'The ID of the user',
    example: 'f61c0ec7-0f83-414e-8e5f-aace86e0ed35',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Jonathan Sandbridge',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@sandbridge.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+44123456789',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    example: '1992-11-28',
  })
  @IsString()
  @IsNotEmpty()
  date_of_birth: string;

  @ApiProperty({
    description: 'The address of the user',
  })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}

export class PaymentRequestDTO {
  @ApiProperty({
    description: 'The amount in minor units',
    example: 1,
  })
  @IsNumber()
  amount_in_minor: number;

  @ApiProperty({
    description: 'The currency of the payment',
    example: 'GBP',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'The payment method details',
  })
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    description: 'The user details',
  })
  @ValidateNested()
  @Type(() => UserDetails)
  user: UserDetails;
}

export class GenerateHeadersDTO {
  @ApiProperty({
    description: 'The API path for which headers are being generated',
    example: '/v3/payments',
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    description: 'The HTTP method for the request',
    example: 'POST',
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    description: 'The body of the request in JSON string format',
    example:
      '{"amount_in_minor": 100, "currency": "GBP", "payment_method": {...}}',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
