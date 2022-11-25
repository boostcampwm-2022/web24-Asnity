import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from '@schemas/community.schema';
import { CreateCommunityDto } from '@api/src/community/dto/create-community.dto';

@Injectable()
export class CommunityRepository {
  constructor(@InjectModel(Community.name) private communityModel: Model<CommunityDocument>) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const result = await this.communityModel.create(createCommunityDto);
    return (result as any)._doc;
  }

  async findById(_id: string) {
    return await this.communityModel.findById(_id);
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.communityModel.findOneAndUpdate(filter, { $addToSet: addArr }, { new: true });
    // console.log('pass');
  }

  async findOne(condition: any) {
    return await this.communityModel.findOne(condition);
  }

  async updateOne(filter, updateField) {
    await this.communityModel.updateOne(filter, updateField);
  }

  async findAndUpdateOne(filter, updateField) {
    return await this.communityModel.findOneAndUpdate(filter, updateField, { new: true });
  }
}
