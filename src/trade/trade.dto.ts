import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
  readonly amount: string;

  @ApiProperty({ description: 'Minimum Bid' })
  @IsNotEmpty({ message: 'Minimum bid is required' })
  readonly minimumBid: string;

  @ApiProperty({ description: 'Bank Name' })
  @IsNotEmpty({ message: 'Bank name is required' })
  readonly bank_name: string;

  @ApiProperty({ description: 'Account Number' })
  @IsNotEmpty({ message: 'Account number is required' })
  readonly account_number: string;

  @ApiProperty({ description: 'Beneficiary Name' })
  @IsNotEmpty({ message: 'Beneficiary name is required' })
  readonly beneficiary_name: string;

  @ApiProperty({ description: 'Beneficiary Account' })
  @IsNotEmpty({ message: 'Beneficiary account is required' })
  readonly beneficiary_account: string;

  
}

export class UpdateTradeDTO {
  @ApiProperty({ description: 'Trade Currency', required: false })
  readonly currency: string;

  @ApiProperty({ description: 'Exit Currency', required: false })
  readonly exit_currency: string;

  @ApiProperty({ description: 'Rate', required: false })
  readonly rate: number;

  @ApiProperty({ description: 'Amount', required: false })
  readonly amount: string;

  @ApiProperty({ description: 'Minimum Bid', required: false })
  readonly minimumBid: string;

  @ApiProperty({ description: 'Bank Name', required: false })
  readonly bank_name: string;

  @ApiProperty({ description: 'Account Number', required: false })
  readonly account_number: string;

  @ApiProperty({ description: 'Beneficiary Name', required: false })
  readonly beneficiary_name: string;

  @ApiProperty({ description: 'Beneficiary Account', required: false })
  readonly beneficiary_account: string;
}
