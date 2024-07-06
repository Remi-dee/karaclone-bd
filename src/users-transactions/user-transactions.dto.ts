// create-user-transaction.dto.ts
import { PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreateUserTransactionDto {
  @ApiProperty({
    description: 'Unique identifier of the transaction',
    example: '0123456789',
  })
  @IsOptional()
  @IsString()
  user_transactionId?: string;

  @ApiProperty({
    description: 'Date and time of the transaction',
    example: '2024-12-01T14:00:00Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Type of the transaction', example: 'Trade' })
  @IsString()
  transaction_type: string;

  @ApiProperty({
    description: 'Name of the bank involved in the transaction',
    example: 'Access Bank',
  })
  @IsString()
  @IsOptional()
  bank_name: string;

  @ApiProperty({
    description: 'Name of the account holder',
    example: 'Ogunsola Omonrisola E',
  })
  @IsString()
  @IsOptional()
  account_name: string;

  @ApiProperty({ description: 'Transaction fee', example: 0.03 })
  @IsNumber()
  @IsOptional()
  transaction_fee: number;

  @ApiProperty({
    description: 'Status of the transaction',
    example: 'Successful',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Payment method used in the transaction',
    example: 'Credit card',
  })
  @IsString()
  payment_method: string;

  @ApiProperty({
    description: 'Beneficiary name for the transaction',
    example: 'Ogunsola Omonrisola',
  })
  @IsString()
  readonly beneficiary_name: string;

  @ApiProperty({
    description: 'Beneficiary account for the transaction',
    example: 2134759278374,
  })
  @IsNumber()
  readonly beneficiary_account: number;

  @ApiProperty({
    description: 'Beneficiary bank for the transaction',
    example: 'Polaris',
  })
  @IsString()
  readonly beneficiary_bank: string;

  @ApiProperty({
    description: 'Currency used in the transaction',
    example: 'NGN',
  })
  @IsString()
  @IsOptional()
  currency: string;

  @ApiProperty({
    description: "Signed in user's used in the transaction",
    example: '123hyssdddj2wj3772whej',
  })
  @IsString()
  @IsOptional()
  user_id: ObjectId;

  @ApiProperty({
    description: 'Amount exchanged',
    example: 2500,
  })
  @IsNumber()
  @IsOptional()
  amount_exchanged: number;

  @ApiProperty({
    description: 'Amount reserved',
    example: 4500,
  })
  @IsNumber()
  @IsOptional()
  amount_reversed: number;

  @ApiProperty({
    description: 'Amount deposited',
    example: 12300,
  })
  @IsNumber()
  @IsOptional()
  amount_deposited: number;

  @ApiProperty({
    description: 'Amount sold',
    example: 58000,
  })
  @IsNumber()
  @IsOptional()
  amount_sold: number;

  @ApiProperty({
    description: 'Amount received',
    example: 7900,
  })
  @IsNumber()
  @IsOptional()
  amount_received: number;
}

export class UpdateUserTransactionDto extends PartialType(
  CreateUserTransactionDto,
) {}
