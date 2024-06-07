import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MonoUser extends Document {
  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ default: '' })
  monoId: string;

  @Prop({ default: '' })
  monoCode: string;

  @Prop({ default: false })
  monoStatus: boolean;

  @Prop({ default: '' })
  monoReauthToken: string;
}

export const MonoUserSchema = SchemaFactory.createForClass(MonoUser);
