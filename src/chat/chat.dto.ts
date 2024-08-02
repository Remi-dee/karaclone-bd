import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello, I need help!', description: 'Chat message' })
  message: string;
}
