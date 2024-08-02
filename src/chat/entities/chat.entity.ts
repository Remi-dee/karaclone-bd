import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: User.name })
  support: User;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
