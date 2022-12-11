import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CHAT_TYPE } from '@utils/def';
import { IsIn, IsString } from 'class-validator';

export type UserDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  name: string;

  @Prop({ required: true })
  @IsIn(CHAT_TYPE)
  type: string;

  @Prop({ required: true })
  @IsString()
  senderId: string;

  @Prop({ required: true })
  @IsString()
  content: string;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
