import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CurrencyConversionDTO {
  @ApiProperty({ description: 'Amount to be converted' })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  readonly amount: number;

  @ApiProperty({ description: 'Source currency' })
  @IsNotEmpty({ message: 'Source currency is required' })
  @IsString({ message: 'Source currency must be a string' })
  readonly sourceCurrency: string;

  @ApiProperty({ description: 'Target currency' })
  @IsNotEmpty({ message: 'Target currency is required' })
  @IsString({ message: 'Target currency must be a string' })
  readonly targetCurrency: string;
}
