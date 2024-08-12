import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Address } from 'src/truelayer/truelayer.dto';

export class CreateBeneficiaryDTO {
  @ApiProperty({ description: 'Beneficiary Name' })
  @IsNotEmpty({ message: 'Beneficiary name is required' })
  readonly name: string;

  @ApiProperty({ description: 'Beneficiary Account' })
  @IsNotEmpty({ message: 'Beneficiary account is required' })
  readonly account: string;

  @ApiProperty({ description: 'Bank Name' })
  @IsNotEmpty({ message: 'Bank name is required' })
  readonly bank_name: string;

  @ApiProperty({ description: 'Bank Currency' })
  @IsNotEmpty({ message: 'Currency is required' })
  readonly currency: string;

  @ApiProperty({ description: 'Swift Code' })
  @IsOptional()
  readonly swift_code: string;

  @ApiProperty({ description: 'ACH Routing' })
  @IsOptional()
  readonly ach_routing: string;

  @ApiProperty({ description: 'Account Type' })
  @IsOptional()
  readonly account_type: string;

  @ApiProperty({ description: 'Bank Address' })
  @IsOptional()
  bank_address: string;

  @ApiProperty({ description: 'Sort Code' })
  @IsOptional()
  sort_code: string;

  @ApiProperty({ description: 'Iban' })
  @IsOptional()
  iban: string;

  @ApiProperty({ description: 'Date of birth' })
  @IsOptional()
  date_of_birth: string;

  @ApiProperty({
    description: 'The user details',
  })
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}


