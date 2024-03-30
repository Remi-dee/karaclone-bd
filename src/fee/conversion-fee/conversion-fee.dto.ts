import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateConversionFeeDTO {
  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Conversion Fee' })
  @IsNotEmpty({ message: 'Conversion fee is required' })
  readonly conversion_fee: string;
}

export class UpdateConversionFeeDTO {
  @ApiProperty({ description: 'Conversion ID' })
  @IsNotEmpty({ message: 'Conversion ID is required' })
  readonly feeId: ObjectId;

  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Conversion Fee' })
  @IsNotEmpty({ message: 'Conversion fee is required' })
  readonly conversion_fee: string;
}
