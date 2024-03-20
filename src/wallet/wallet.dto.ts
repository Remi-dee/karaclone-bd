import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWalletDTO {
  @ApiProperty({ description: 'User Id' })
  @IsNotEmpty({ message: 'User Id is required' })
  readonly userId: string;

  @ApiProperty({ description: 'Wallet currency code' })
  @IsNotEmpty({ message: 'Currency code is required' })
  readonly currency_code: string;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsNotEmpty({ message: 'Escrow balance is required' })
  readonly escrow_balance: number;
}

export class UpdateWalletDTO {
  @ApiProperty({ description: 'Wallet balance' })
  @IsNotEmpty({ message: 'Wallet balance is required' })
  readonly balance: number;

  @ApiProperty({ description: 'Wallet escrow balance' })
  @IsNotEmpty({ message: 'Escrow balance is required' })
  readonly escrow_balance: number;
}
