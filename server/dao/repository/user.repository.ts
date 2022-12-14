import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { BOT_ID } from '@utils/def';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

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
    if (filter._id) {
      this.redis.del(`user/${filter._id}`);
    }
    await this.userModel.updateOne(filter, updateField);
  }

  async appendElementAtArr(filter, appendElement) {
    await this.userModel.updateOne(filter, { $push: appendElement });
  }

  async updateObject(filter, appendElement) {
    if (filter._id) {
      this.redis.del(`user/${filter._id}`);
    }
    return await this.userModel.updateOne(filter, { $set: appendElement });
  }

  async deleteObject(filter, appendElement) {
    if (filter._id) {
      this.redis.del(`user/${filter._id}`);
    }
    return await this.userModel.updateOne(filter, { $unset: appendElement }, { new: true });
  }

  async deleteElementAtArr(filter, removeElement) {
    if (filter._id) {
      this.redis.del(`user/${filter._id}`);
    }
    await this.userModel.updateOne(filter, { $pullAll: removeElement });
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    if (filter._id) {
      this.redis.del(`user/${filter._id}`);
    }
    return await this.userModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }
}
