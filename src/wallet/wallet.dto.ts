import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWalletDTO {
  @ApiProperty({ description: 'Wallet currency code' })
  @IsNotEmpty({ message: 'Currency code is required' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsNotEmpty({ message: 'Escrow balance is required' })
  readonly escrow_balance: number;

  @ApiProperty({ description: 'User id' })
  // @IsNotEmpty({ message: 'is required' })
  user: Types.ObjectId;
}

export class UpdateWalletDTO {
  @ApiProperty({ description: 'Wallet currency code' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsOptional({ message: 'Currency code is optional' })
  readonly escrow_balance: number;
}
