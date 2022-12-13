import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from '@schemas/community.schema';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

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
    // await this.redis.del(`community/${_id}`);
    const cache = await this.redis.get(`community/${_id}`);
    if (cache) {
      console.log(JSON.parse(cache));
      console.log('hit cache');
      return JSON.parse(cache);
    }
    const result = await this.communityModel.findById(_id);
    await this.redis.set(`community/${_id}`, JSON.stringify(result));
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
      await this.redis.set(`community/${filter._id}`, JSON.stringify(result));
    }
    return result;
  }

  async findOne(condition: any) {
    return await this.communityModel.findOne(condition);
  }

  async updateOne(filter, updateField) {
    await this.communityModel.updateOne(filter, updateField);
    if (filter._id) {
      await this.redis.del(`community/${filter._id}`);
    }
  }

  async findAndUpdateOne(filter, updateField) {
    const result = await this.communityModel.findOneAndUpdate(filter, updateField, { new: true });
    if (filter._id) {
      await this.redis.set(`community/${filter._id}`, JSON.stringify(result));
    }
    return result;
  }

  async deleteElementAtArr(filter, removeElement) {
    const result = await this.communityModel.updateOne(filter, { $pullAll: removeElement });
    if (filter._id) {
      this.redis.del(`community/${filter._id}`);
    }
  }
}
