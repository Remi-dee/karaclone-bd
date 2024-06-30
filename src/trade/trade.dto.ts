import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTradeDTO {
  @ApiProperty({ description: 'Trade Currency' })
  @IsNotEmpty({ message: 'Trade currency is required' })
  readonly currency: string;

  @ApiProperty({ description: 'Exit Currency' })
  @IsNotEmpty({ message: 'Exit currency is required' })
  readonly exit_currency: string;

  @ApiProperty({ description: 'Rate' })
  @IsNotEmpty({ message: 'Rate is required' })
  readonly rate: number;

  @ApiProperty({ description: 'Amount' })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ description: 'Minimum Bid' })
  @IsNotEmpty({ message: 'Minimum bid is required' })
  readonly minimumBid: string;

  @ApiProperty({ description: 'Bank Name' })
  @IsOptional()
  readonly bank_name: string;

  @ApiProperty({ description: 'Payment Method' })
  @IsNotEmpty({ message: 'Payment Method is required' })
  payment_method: string;

  @ApiProperty({ description: 'Transaction Fee' })
  @IsNotEmpty({ message: 'Transaction Fee is required' })
  transaction_fee: string;

  @ApiProperty({ description: 'Vat Fee' })
  @IsNotEmpty({ message: 'Vat Fee is required' })
  vat_fee: string;

  @ApiProperty({ description: 'Account Number' })
  @IsOptional()
  readonly account_number: string;

  @ApiProperty({ description: 'Account Name' })
  @IsOptional()
  readonly account_name: string;

  @ApiProperty({ description: 'Additional Information', required: false })
  @IsOptional()
  @IsString()
  readonly additional_information?: string;

  @ApiProperty({ description: 'Beneficiary Name' })
  @IsNotEmpty({ message: 'Beneficiary name is required' })
  readonly beneficiary_name: string;

  @ApiProperty({ description: 'Beneficiary Account' })
  @IsNotEmpty({ message: 'Beneficiary account is required' })
  readonly beneficiary_account: string;

  @ApiProperty({ description: 'Sold Amount', default: 0 })
  readonly sold?: number = 0;

  @ApiProperty({ description: 'Beneficiary Account' })
  @IsNotEmpty({ message: 'Beneficiary account is required' })
  readonly beneficiary_bank: string;
}

export class UpdateTradeDTO {
  @ApiProperty({ description: 'Trade Currency', required: false })
  readonly currency: string;

  @ApiProperty({ description: 'Exit Currency', required: false })
  readonly exit_currency: string;

  @ApiProperty({ description: 'Rate', required: false })
  readonly rate: number;

  @ApiProperty({ description: 'Amount', required: false })
  @IsNumber()
  readonly amount: string;

  @ApiProperty({ description: 'Minimum Bid', required: false })
  readonly minimumBid: string;

  @ApiProperty({ description: 'Bank Name', required: false })
  readonly bank_name: string;

  @ApiProperty({ description: 'Account Number', required: false })
  readonly account_number: string;
}

export class BuyTradeDTO {
  @ApiProperty({ description: 'Trade ID' })
  @IsNotEmpty({ message: 'Trade ID is required' })
  readonly tradeId: string;

  @ApiProperty({ description: 'Amount to Buy' })
  @IsNotEmpty({ message: 'Amount to buy is required' })
  @IsNumber()
  readonly purchase: number;

  @ApiProperty({ description: 'Beneficiary Name' })
  @IsNotEmpty({ message: 'Beneficiary name is required' })
  @IsString()
  readonly beneficiary_name: string;

  @ApiProperty({ description: 'Beneficiary Account' })
  @IsNotEmpty({ message: 'Beneficiary account is required' })
  @IsString()
  readonly beneficiary_account: string;

  @ApiProperty({ description: 'Beneficiary Bank' })
  @IsNotEmpty({ message: 'Beneficiary bank is required' })
  @IsString()
  readonly beneficiary_bank: string;

  @ApiProperty({ description: 'Payment Method' })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsString()
  readonly payment_method: string;

  @ApiProperty({ description: 'Account Number' })
  @IsOptional()
  readonly account_number: string;

  @ApiProperty({ description: 'Account Name' })
  @IsOptional()
  readonly account_name: string;

  @ApiProperty({ description: 'Bank Name' })
  @IsOptional()
  readonly bank_name: string;
}
