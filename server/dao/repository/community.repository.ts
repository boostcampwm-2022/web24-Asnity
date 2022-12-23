import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from '@schemas/community.schema';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserDocument } from '@schemas/user.schema';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectModel(Community.name) private communityModel: Model<CommunityDocument>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const result = await this.communityModel.create(createCommunityDto);
    return (result as any)._doc;
  }

  async findById(_id: string) {
    return await this.communityModel.findById(_id);
  }

  async findByIdAfterCache(_id: string) {
    const cache = await this.getCache(_id);
    if (cache) {
      return JSON.parse(cache);
    }
    const result = await this.communityModel.findById(_id);
    await this.storeCache(_id, result);
    return result;
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    const result = await this.communityModel.findOneAndUpdate(
      filter,
      { $addToSet: addArr },
      { new: true },
    );
    if (filter._id) {
      await this.storeCache(filter._id, result);
    }
    return result;
  }

  async findOne(condition: any) {
    return await this.communityModel.findOne(condition);
  }

  async updateOne(filter, updateField) {
    this.deleteCache(filter._id);
    await this.communityModel.updateOne(filter, updateField);
  }

  async findAndUpdateOne(filter, updateField) {
    const result = await this.communityModel.findOneAndUpdate(filter, updateField, { new: true });
    if (filter._id) {
      await this.storeCache(filter._id, result);
    }
    return result;
  }

  async deleteElementAtArr(filter, removeElement) {
    this.deleteCache(filter._id);
    await this.communityModel.updateOne(filter, { $pullAll: removeElement });
  }

  async deleteCache(_id: string) {
    if (_id) {
      this.redis.del(`community/${_id}`);
    }
  }

  async storeCache(_id: string, result: CommunityDocument) {
    await this.redis.set(`community/${_id}`, JSON.stringify(result));
  }

  async getCache(_id: string) {
    return await this.redis.get(`community/${_id}`);
  }
}
