import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotificationDto } from './notification.dto';

@ApiTags('Notification')
@ApiBearerAuth('Authorization')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createNotification(
    @Req() req,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const userId = req.user.id;
    const notification = await this.notificationService.createNotification(
      userId,
      createNotificationDto.message,
      createNotificationDto.type,
    );
    return {
      statusCode: 201,
      message: 'Notification created successfully',
      data: notification,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get a notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification has been retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getNotifications(@Req() req) {
    const userId = req.user.id;
    const notifications =
      await this.notificationService.getNotifications(userId);
    return {
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: notifications,
    };
  }

  @Patch('/read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 201,
    description: 'Notification has been marked as read successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async markAllAsRead(@Req() req) {
    const userId = req.user.id;
    await this.notificationService.markAllAsRead(userId);
    return {
      statusCode: 200,
      message: 'All notifications marked as read',
    };
  }
}
