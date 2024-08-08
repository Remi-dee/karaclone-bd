import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Chat } from './entities/chat.entity';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { conversationIdDto, CreateMessageDto } from './chat.dto';
import { Types } from 'mongoose';

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
    const { message, conversationId } = createMessageDto;
    return this.chatService.createMessage(
      userId,
      message,
      isSupport,
      conversationId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get chat messages for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Chat messages retrieved.',
    type: [Chat],
  })
  async getMessages(@Req() req, @Query('conversationId') conversationId?: any) {
    const userId = req.user.id;
    const conversationObjectId = conversationId ? conversationId : undefined;
    return this.chatService.getMessages(userId, conversationObjectId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversation IDs' })
  @ApiResponse({
    status: 200,
    description: 'All conversation IDs retrieved.',
  })
  async getAllConversations() {
    return this.chatService.getAllConversations();
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Get chat messages for a specific conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat messages retrieved for the conversation.',
    type: [Chat],
  })
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getMessagesByConversationId(conversationId);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all chat messages' })
  @ApiResponse({
    status: 200,
    description: 'All messages deleted.',
  })
  async deleteAllMessages() {
    return this.chatService.deleteAllMessages();
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all messages for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User messages deleted.',
  })
  async deleteUserMessages(@Req() req) {
    const userId = req.user.id;
    return this.chatService.deleteUserMessages(userId);
  }
}
