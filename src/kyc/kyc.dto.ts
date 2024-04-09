import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKYCDTO {
  @ApiProperty({ description: 'User country' })
  @IsNotEmpty({ message: 'user country is required' })
  country: string;

  @ApiProperty({ description: 'ID Document type' })
  @IsNotEmpty({ message: 'ID document type is required' })
  id_document_type: string;

  @ApiProperty({ description: 'ID Document' })
  @IsNotEmpty({ message: 'ID Document is required' })
  id_document: string;

  @ApiProperty({ description: 'Address document type' })
  @IsNotEmpty({ message: 'Address document type is required' })
  address_document_type: string;

  @ApiProperty({ description: 'Address document' })
  @IsNotEmpty({ message: 'Address document is required' })
  address_document: string;

  @ApiProperty({ description: 'CAC Document' })
  cac_document: string;

  @ApiProperty({ description: 'CAC Document' })
  @IsNotEmpty({ message: 'User bank verification is required' })
  bvn: string;

  @ApiProperty({ description: 'Is user a politician' })
  is_politician: boolean;

  @ApiProperty({ description: 'Is user criminal convict' })
  is_criminal_convict: boolean;
}
