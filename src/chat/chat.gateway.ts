import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() { userId, message }: { userId: string; message: string },
  ) {
    // const chat = await this.chatService.createMessage(userId, message);
    // this.server.emit('receiveMessage', chat);
  }
}
