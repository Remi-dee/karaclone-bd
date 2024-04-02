import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateConversionFeeDTO {
  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Conversion Fee' })
  @IsNotEmpty({ message: 'Conversion fee is required' })
  readonly conversion_fee: string;
}

export class UpdateConversionFeeDTO {
  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Conversion Fee' })
  @IsNotEmpty({ message: 'Conversion fee is required' })
  readonly conversion_fee: string;
}
