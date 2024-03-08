import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class IActivationToken {
  token: string;
  activationCode: string;
}

// activate user
export class IActivationRequest {
  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  activation_token: string;

  @ApiProperty({ description: 'Name of user' })
  @IsNotEmpty({ message: 'Name is required' })
  activation_code: string;
}
