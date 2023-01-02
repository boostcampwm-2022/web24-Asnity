import { Injectable } from '@nestjs/common';
import { ChatList, ChatListDocument } from '@schemas/chat-list.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class ChatListRespository {
  constructor(
    @InjectModel(ChatList.name) private chatListModel: Model<ChatListDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(chat) {
    return await this.chatListModel.create(chat);
  }
  async findById(_id: string) {
    return await this.chatListModel.findById(_id);
  }

  async findByIdAfterCache(_id: string) {
    const cache = await this.getCache(_id);
    if (cache) {
      return JSON.parse(cache);
    }
    return await this.chatListModel.findById(_id);
  }

  async addArrAtArr(filter, attribute, appendArr) {
    this.deleteCache(filter._id);
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.chatListModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }

  async updateOne(filter, updateField) {
    this.deleteCache(filter._id);
    return await this.chatListModel.updateOne(filter, updateField);
  }

  async findOneAndUpdate(filter, updateField) {
    this.deleteCache(filter._id);
    return await this.chatListModel.findOneAndUpdate(filter, updateField, { new: true });
  }

  async deleteCache(_id: string) {
    if (_id) {
      this.redis.del(`chats/${_id}`);
    }
  }

  async storeCache(_id: string, result: ChatListDocument) {
    await this.redis.set(`chats/${_id}`, JSON.stringify(result));
    await this.redis.expire(`chats/${_id}`, 5 * 60);
  }

  async getCache(_id: string) {
    return await this.redis.get(`chats/${_id}`);
  }

  async saveNextExpectedChats(_id: string) {
    if (_id === undefined) return;
    const cache = await this.getCache(_id);
    if (!cache) {
      this.findById(_id).then((data) => {
        this.storeCache(_id, data);
      });
    }
  }
}
