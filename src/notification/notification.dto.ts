import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Message',
    example: 'Your transaction is successful',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  type: string;
}
