import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
  ) {}

  async createNotification(
    userId: string,
    message: string,
    type: string,
  ): Promise<Notification> {
    const newNotification = new this.notificationModel({
      userId,
      message,
      type,
    });
    return newNotification.save();
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ userId }, { read: true });
  }
}
