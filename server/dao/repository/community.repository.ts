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

  async findOne(condition: any) {
    return await this.communityModel.findOne(condition);
  }
}
