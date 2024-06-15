import { IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentRequestDTO {
  @ApiProperty({
    description: 'Amount in minor currency units',
    example: 100,
  })
  @IsNumber()
  amount_in_minor: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'GBP',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Payment method details',
    type: Object,
  })
  @IsObject()
  payment_method: object;

  @ApiProperty({
    description: 'User details',
    type: Object,
  })
  @IsObject()
  user: object;
}
