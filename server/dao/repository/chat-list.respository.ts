import { Injectable } from '@nestjs/common';
import { ChatList, ChatListDocument } from '@schemas/chat-list.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatListRespository {
  constructor(@InjectModel(ChatList.name) private chatListModel: Model<ChatListDocument>) {}
}
