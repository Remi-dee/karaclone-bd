import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateConversionFeeDTO {
  @ApiProperty({ description: 'Conversion type' })
  @IsNotEmpty({ message: 'Conversion type is required' })
  readonly conversion_type: string;

  @ApiProperty({ description: 'User type' })
  @IsNotEmpty({ message: 'User type is required' })
  readonly user_type: string;

  @ApiProperty({ description: 'Minimum amount' })
  @IsNotEmpty({ message: 'Minimum amount is required' })
  readonly minimum_amount: string;

  @ApiProperty({ description: 'Maximum amount' })
  @IsNotEmpty({ message: 'Maximum amount is required' })
  readonly maximum_amount: string;

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

  @ApiProperty({ description: 'Conversion type' })
  @IsNotEmpty({ message: 'Conversion type is required' })
  readonly conversion_type: string;

  @ApiProperty({ description: 'User type' })
  @IsNotEmpty({ message: 'User type is required' })
  readonly user_type: string;

  @ApiProperty({ description: 'Minimum amount' })
  @IsNotEmpty({ message: 'Minimum amount is required' })
  readonly minimum_amount: string;

  @ApiProperty({ description: 'Maximum amount' })
  @IsNotEmpty({ message: 'Maximum amount is required' })
  readonly maximum_amount: string;

  @ApiProperty({ description: 'Currency pair' })
  @IsNotEmpty({ message: 'Currency pair is required' })
  readonly currency_pair: string;

  @ApiProperty({ description: 'Conversion Fee' })
  @IsNotEmpty({ message: 'Conversion fee is required' })
  readonly conversion_fee: string;
}
