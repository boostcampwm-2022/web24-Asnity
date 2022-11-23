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
}
