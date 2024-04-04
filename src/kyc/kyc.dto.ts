import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKYCDTO {
  @ApiProperty({ description: 'Base currency pair' })
  @IsNotEmpty({ message: 'Base currency is required' })
  country: string;

  @ApiProperty({ description: 'Quoted currency pair' })
  @IsNotEmpty({ message: 'Quote currency is required' })
  id_document_type: string;

  @ApiProperty({ description: 'Currency pair exchange rate' })
  @IsNotEmpty({ message: 'Exchange rate is required' })
  id_document: string;

  @ApiProperty({ description: 'Quoted currency pair' })
  @IsNotEmpty({ message: 'Quote currency is required' })
  address_document_type: string;

  @ApiProperty({ description: 'Currency pair exchange rate' })
  @IsNotEmpty({ message: 'Exchange rate is required' })
  address_document: string;

  @ApiProperty({ description: 'Currency pair exchange rate' })
  cac_document: string;
}
