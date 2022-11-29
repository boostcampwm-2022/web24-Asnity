import { Injectable } from '@nestjs/common';
import { ChatList, ChatListDocument } from '@schemas/chat-list.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatListRespository {
  constructor(@InjectModel(ChatList.name) private chatListModel: Model<ChatListDocument>) {}

  async create(chat) {
    return await this.chatListModel.create(chat);
  }
  async findById(_id: string) {
    return await this.chatListModel.findById(_id);
  }
  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.chatListModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }
}
