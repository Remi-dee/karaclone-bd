import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWalletDTO {
  @ApiProperty({ description: 'Wallet currency code' })
  @IsNotEmpty({ message: 'Currency code is required' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsNotEmpty({ message: 'Escrow balance is required' })
  readonly amount: number;

  @ApiProperty({ description: 'User id' })
  // @IsNotEmpty({ message: 'is required' })
  user: Types.ObjectId;

  // @ApiProperty({ description: 'User id' })
  // @IsOptional()
  // // @IsNotEmpty({ message: 'is required' })
  // payment_method: string;

  // @ApiProperty({ description: 'User id' })
  // @IsOptional()
  // // @IsNotEmpty({ message: 'is required' })
  // transaction_fee: string;
}

export class UpdateWalletDTO {
  @ApiProperty({ description: 'Wallet currency code' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly escrow_balance: number;
}

export class DeductWalletDTO {
  @ApiProperty({ description: 'Wallet currency code' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly amount: number;
}
