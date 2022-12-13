import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { BOT_ID } from '@utils/def';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.userModel.create(createUserDto);
    return null;
  }

  async findOne(condition: any) {
    return await this.userModel.findOne(condition);
  }

  async findUser(conditions: any) {
    return await this.userModel.find({ $and: [{ $or: conditions }, { _id: { $ne: BOT_ID } }] });
  }

  async findById(_id: string) {
    const result = await this.userModel.findById(_id);
    this.redis.set(`user/${_id}`, JSON.stringify(result));
    return result;
  }

  async findByIdAfterCache(_id: string) {
    const cache = await this.redis.get(`user/${_id}`);
    if (cache) {
      return JSON.parse(cache);
    }
    const result = await this.userModel.findById(_id);
    await this.redis.set(`user/${_id}`, JSON.stringify(result));
    return result;
  }

  async updateOne(filter, updateField) {
    await this.userModel.updateOne(filter, updateField);
  }

  async appendElementAtArr(filter, appendElement) {
    await this.userModel.updateOne(filter, { $push: appendElement });
  }

  async updateObject(filter, appendElement) {
    return await this.userModel.updateOne(filter, { $set: appendElement });
  }

  async deleteObject(filter, appendElement) {
    return await this.userModel.updateOne(filter, { $unset: appendElement }, { new: true });
  }

  async deleteElementAtArr(filter, removeElement) {
    await this.userModel.updateOne(filter, { $pullAll: removeElement });
  }

  async deleteElementAtArr2(_id, removeElement) {
    await this.userModel.findByIdAndUpdate(_id, { $pullAll: removeElement }, { new: true });
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.userModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }

  // async set(filter, obj) {
  //   const user = new User();
  //
  //   this.userModel.find(filter).communities.set();
  // }
}
