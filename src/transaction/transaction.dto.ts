import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FundWalletDTO {
  @ApiProperty({ description: 'Currency to be funded' })
  @IsNotEmpty({ message: 'Currency code is required' })
  currency_code: string;

  @ApiProperty({ description: 'Amount to be funded' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
