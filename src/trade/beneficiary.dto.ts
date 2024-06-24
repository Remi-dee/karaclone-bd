import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  readonly currency: string;

  @ApiProperty({ description: 'Swift Code' })
  readonly swift_code: string;

  @ApiProperty({ description: 'ACH Routing' })
  ACH_Routing: string;

  @ApiProperty({ description: 'Account Type' })
  Account_Type: string;

  @ApiProperty({ description: 'Bank Address' })
  bank_address: string;
}
