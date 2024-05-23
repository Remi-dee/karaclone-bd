import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BuyXLMDTO {
  @ApiProperty({ description: 'Amount of XLM to purchase' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @ApiProperty({ description: 'Purchase destination' })
  @IsNotEmpty({ message: 'Purchase destination is required' })
  destinationId: string;

  @ApiProperty({ description: 'Wallet source secret' })
  @IsNotEmpty({ message: 'Wallet source secret key is required' })
  sourceSecret: string;
}
