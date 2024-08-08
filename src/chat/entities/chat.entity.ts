import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  support: Types.ObjectId;

  @Prop({ type: String, required: true })
  conversationId: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
