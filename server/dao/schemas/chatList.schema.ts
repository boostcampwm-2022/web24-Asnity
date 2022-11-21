import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Chat } from './chat.schema';
import { ArrayMaxSize } from 'class-validator';

export type ChatListDocument = ChatList & Document;

@Schema()
export class ChatList {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }] })
  @ArrayMaxSize(100)
  chat: Chat[];

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  firstChatTime: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  lastChatTime: Date;
}
export const ChatListSchema = SchemaFactory.createForClass(ChatList);
