import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionFeeDTO {
  @ApiProperty({ description: 'Transaction type' })
  @IsNotEmpty({ message: 'Transaction type is required' })
  readonly transaction_type: string;

  @ApiProperty({ description: 'User type' })
  @IsNotEmpty({ message: 'User type is required' })
  readonly user_type: string;

  @ApiProperty({ description: 'Minimum amount' })
  @IsNotEmpty({ message: 'Minimum amount is required' })
  readonly minimum_amount: string;

  @ApiProperty({ description: 'Maximum amount' })
  @IsNotEmpty({ message: 'Maximum amount is required' })
  readonly maximum_amount: string;

  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Transaction Fee' })
  @IsNotEmpty({ message: 'Transaction fee is required' })
  readonly transaction_fee: string;
}

export class UpdateTransactionFeeDTO {
  @ApiProperty({ description: 'Transaction type' })
  @IsNotEmpty({ message: 'Transaction type is required' })
  readonly transaction_type: string;

  @ApiProperty({ description: 'User type' })
  @IsNotEmpty({ message: 'User type is required' })
  readonly user_type: string;

  @ApiProperty({ description: 'Minimum amount' })
  @IsNotEmpty({ message: 'Minimum amount is required' })
  readonly minimum_amount: string;

  @ApiProperty({ description: 'Maximum amount' })
  @IsNotEmpty({ message: 'Maximum amount is required' })
  readonly maximum_amount: string;

  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Transaction Fee' })
  @IsNotEmpty({ message: 'Transaction fee is required' })
  readonly transaction_fee: string;
}
