import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from '@schemas/community.schema';
import { ChannelRepository } from '@repository/channel.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }])],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository],
})
export class ChannelModule {}
