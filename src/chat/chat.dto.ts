import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello, I need help!', description: 'Chat message' })
  message: string;

  @ApiProperty({ description: 'This is conversation id' })
  conversationId: string;
}

export class conversationIdDto {


  @ApiProperty({ description: 'This is conversation id' })
  conversationId: string;
}