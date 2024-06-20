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
}
