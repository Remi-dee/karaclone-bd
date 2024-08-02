import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Chat } from './entities/chat.entity';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { CreateMessageDto } from './chat.dto';

@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat message' })
  @ApiResponse({ status: 201, description: 'Message created.', type: Chat })
  async createMessage(@Req() req, @Body() createMessageDto: any) {
    const userId = req.user.id;
    const isSupport = req.user.role === 'admin';
    return this.chatService.createMessage(
      userId,
      createMessageDto.message,
      isSupport,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get chat messages for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Chat messages retrieved.',
    type: [Chat],
  })
  async getMessages(@Req() req) {
    const userId = req.user.id;
    console.log('this is user id', userId);
    return this.chatService.getMessages(userId);
  }
}
