import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel, ChannelDocument } from '@schemas/channel.schema';
import { CreateChannelDto } from '@api/src/channel/dto';

@Injectable()
export class ChannelRepository {
  constructor(@InjectModel(Channel.name) private channelModel: Model<ChannelDocument>) {}

  async create(createChannelDto: CreateChannelDto) {
    return await this.channelModel.create(createChannelDto);
  }

  async findOne(condition: any) {
    return await this.channelModel.findOne(condition);
  }

  async updateOne(filter, updateField) {
    return await this.channelModel.updateOne(filter, updateField);
  }

  async deleteElementAtArr(filter, removeElement) {
    return await this.channelModel.updateOne(filter, {
      $pullAll: removeElement,
    });
  }

  async findById(_id: string) {
    return await this.channelModel.findById(_id);
  }

  async findOr(conditions: any) {
    return await this.channelModel.find({ $or: conditions });
  }

  async findAndUpdateOne(filter, updateField) {
    return await this.channelModel.findOneAndUpdate(filter, updateField, { new: true });
  }

  async addArrAtArr(filter, attribute, appendArr) {
    const addArr = {};
    addArr[attribute] = { $each: appendArr };
    return await this.channelModel.findByIdAndUpdate(filter, { $addToSet: addArr }, { new: true });
  }
}
