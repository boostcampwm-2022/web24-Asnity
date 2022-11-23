import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel } from 'diagnostics_channel';
import { ChannelDocument } from '@schemas/channel.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChannelRepository {
  constructor(@InjectModel(Channel.name) private communityModel: Model<ChannelDocument>) {}
}
