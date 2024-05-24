import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CurrencyConversionDTO {
  @ApiProperty({ description: 'Amount to be converted' })
  @IsNotEmpty({ message: 'Amount is required' })
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

export class ExchangeRateDTO {
  @ApiProperty({ description: 'Base currency' })
  @IsNotEmpty({ message: 'Base currency is required' })
  @IsString({ message: 'Base currency must be a string' })
  baseCurrency: string;

  @ApiProperty({ description: 'Quote currency' })
  @IsNotEmpty({ message: 'Quote currency is required' })
  @IsString({ message: 'Quote currency must be a string' })
  quoteCurrency: string;
}
