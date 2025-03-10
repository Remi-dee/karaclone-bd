import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
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

class PaymentBeneficiary {
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
  @Type(() => PaymentBeneficiary)
  beneficiary: PaymentBeneficiary;
}

export class Address {
  @ApiProperty({
    description: 'The first line of the address',
    example: '40 Finsbury Square',
  })
  @IsOptional()
  address_line1: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'London',
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'London',
  })
  @IsOptional()
  state: string;

  @ApiProperty({
    description: 'The zip code of the address',
    example: 'EC2A 1PX',
  })
  @IsOptional()
  zip: string;

  @ApiProperty({
    description: 'The country code of the address',
    example: 'GB',
  })
  @IsOptional()
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

class AccountIdentifier {
  @ApiProperty({
    description: 'Account number type',
    example: 'sort_code_account_number',
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    description: 'Account number sort code',
    example: '040668',
  })
  @IsString()
  @IsOptional()
  sort_code: string;

  @ApiProperty({
    description: 'Account number',
    example: '00004668',
  })
  @IsString()
  @IsOptional()
  account_number: string;
}

class WithdrawBeneficiary {
  @ApiProperty({
    description: 'The type of beneficiary',
    example: 'external_account',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Account Holder name',
    example: 'John Sandbridge',
  })
  @IsString()
  @IsNotEmpty()
  account_holder_name: string;

  @ApiProperty({
    description: 'The account identifier',
    type: AccountIdentifier,
  })
  @ValidateNested()
  @Type(() => AccountIdentifier)
  @IsNotEmpty()
  account_identifier: AccountIdentifier;
}

export class WithdrawalRequestDTO {
  // @ApiProperty({
  //   description: 'UUID identifying the user for the current client',
  //   example: '4e9eaf16-8334-43d5-b97c-3d64a1f1d842',
  //   required: false,
  // })
  // @IsUUID()
  // @IsOptional()
  // transaction_id: string;

  @ApiProperty({
    description: 'The beneficiary details',
    type: WithdrawBeneficiary,
  })
  @ValidateNested()
  @Type(() => WithdrawBeneficiary)
  beneficiary: WithdrawBeneficiary;

  @ApiProperty({
    description: 'The address of the user',
    type: Address,
  })
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty({
    description: 'Currency of the payment',
    example: 'EUR',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: "The 'cent' value representing the amount. eg 100 = 1EUR",
    example: 70000,
  })
  @IsInt()
  amount_in_minor: number;

  @ApiProperty({
    description: 'Payment reference',
    example: 'Example reference that identifies the payment',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Date of Birth',
    example: '1991-05-32',
  })
  @IsString()
  date_of_birth: string;
}

class AccountDTO {
  @ApiProperty({
    description: 'Type of the account',
    example: 'sort_code_account',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: "Sort code of the remitter's bank",
    example: '123456',
  })
  @IsString()
  sort_code: string;

  @ApiProperty({
    description: "Account number of the remitter's bank",
    example: '12345678',
  })
  @IsString()
  account_number: string;
}

class RemitterDTO {
  @ApiProperty({ description: 'Name of the remitter', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Account details of the remitter',
    type: AccountDTO,
  })
  @ValidateNested()
  @Type(() => AccountDTO)
  account: AccountDTO;

  @ApiProperty({
    description: 'Reference for the remitter',
    example: 'Payment for services',
  })
  @IsString()
  @IsOptional()
  remitter_reference?: string;
}

class AuthFlowDTO {
  @ApiProperty({
    description: 'Type of the auth flow',
    example: 'sort_code_account',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Return URI after the auth flow',
    example: 'https://example.com/return',
  })
  @IsString()
  return_uri: string;

  @ApiProperty({
    description: 'IP address of the payment service user',
    example: '192.168.0.1',
  })
  @IsString()
  @IsOptional()
  psu_ip_address?: string;

  @ApiProperty({ description: 'Data access token', example: 'token123' })
  @IsString()
  @IsOptional()
  data_access_token?: string;

  @ApiProperty({
    description: 'Additional inputs for the auth flow',
    type: Object,
  })
  @IsObject()
  @IsOptional()
  additional_inputs?: Record<string, any>;
}

class DepositDTO {
  @ApiProperty({
    description: 'Unique identifier for the deposit',
    example: 'deposit123',
  })
  @IsString()
  deposit_id: string;

  @ApiProperty({
    description: 'ID of the provider handling the deposit',
    example: 'provider123',
  })
  @IsString()
  provider_id: string;

  @ApiProperty({
    description: 'ID of the payment scheme used',
    example: 'scheme123',
  })
  @IsString()
  scheme_id: string;

  @ApiProperty({
    description: 'ID representing the fee option chosen for the deposit',
    example: 'fee123',
  })
  @IsString()
  @IsOptional()
  fee_option_id?: string;

  @ApiProperty({
    description: 'Amount of the deposit in minor units',
    example: 10000,
  })
  @IsNumber()
  amount_in_minor: number;

  @ApiProperty({ description: 'Currency of the deposit', example: 'GBP' })
  @IsString()
  @IsIn(['GBP', 'EUR'])
  currency: string;
}

export class DirectDepositRequestDTO {
  @ApiProperty({ description: 'UUID identifying the user', example: 'user123' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Details of the deposit', type: DepositDTO })
  @ValidateNested()
  @Type(() => DepositDTO)
  deposit: DepositDTO;

  @ApiProperty({ description: 'Details of the remitter', type: RemitterDTO })
  @ValidateNested()
  @Type(() => RemitterDTO)
  remitter: RemitterDTO;

  @ApiProperty({ description: 'Details of the auth flow', type: AuthFlowDTO })
  @ValidateNested()
  @Type(() => AuthFlowDTO)
  auth_flow: AuthFlowDTO;
}
