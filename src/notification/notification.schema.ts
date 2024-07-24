import { Schema, Document, model } from 'mongoose';

export interface Notification extends Document {
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: string;
}

export const NotificationSchema = new Schema<Notification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
});

export const NotificationModel = model<Notification>(
  'Notification',
  NotificationSchema,
);
