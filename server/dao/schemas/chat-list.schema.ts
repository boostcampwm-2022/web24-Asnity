import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ArrayMaxSize } from 'class-validator';

export type ChatListDocument = ChatList & Document;

@Schema()
export class ChatList {
  @Prop({
    type: [
      {
        type: Map,
        of: new mongoose.Schema({
          id: { type: String },
          type: { type: String },
          content: { type: String },
          senderId: { type: String },
          createdAt: { type: mongoose.Schema.Types.Date, default: new Date() },
          updatedAt: { type: mongoose.Schema.Types.Date, default: new Date() },
          deletedAt: { type: mongoose.Schema.Types.Date },
        }),
      },
    ],
  })
  @ArrayMaxSize(100)
  chat;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  firstChatTime: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  lastChatTime: Date;
}
export const ChatListSchema = SchemaFactory.createForClass(ChatList);
