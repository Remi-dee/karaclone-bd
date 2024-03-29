import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CurrencyPair } from './currency-pair.schema';

export class CurrencyPairListResponse {
  @ApiProperty({
    description: 'List of currency pairs',
    example: [
      {
        isDeleted: false,
        deletedAt: null,
        createdAt: '2024-03-29T09:49:04.761Z',
        updatedAt: '2024-03-29T09:49:04.761Z',
        base_currency: 'USD',
        quote_currency: 'NGN',
        exchange_rate: 1200,
        _id: '66068fb739a580ce4992d7f8',
        __v: 0,
      },
    ],
  })
  readonly currencyPairs: CurrencyPair[];

  @ApiProperty({ description: 'Count of messages', example: 1 })
  readonly count: number;
}

export class CurrencyPairResponse {
  @ApiProperty({
    description: 'Operation message',
    example: 'Operation was successful',
  })
  readonly messages: string;

  @ApiProperty({ description: 'Message object' })
  readonly currencyPair: CurrencyPair;
}

export class AddCurrencyPairDTO {
  @ApiProperty({ description: 'Base currency pair' })
  @IsNotEmpty({ message: 'Base currency is required' })
  base_currency: string;

  @ApiProperty({ description: 'Quoted currency pair' })
  @IsNotEmpty({ message: 'Quote currency is required' })
  quote_currency: string;

  @ApiProperty({ description: 'Currency pair exchange rate' })
  @IsNotEmpty({ message: 'Exchange rate is required' })
  exchange_rate: number;
}

export class UpdateCurrencyPairDTO {
  @ApiProperty({ description: 'Base currency pair', required: false })
  base_currency: string;

  @ApiProperty({ description: 'Quoted currency pair', required: false })
  quote_currency: string;

  @ApiProperty({ description: 'Currency pair exchange rate', required: false })
  exchange_rate: number;
}
