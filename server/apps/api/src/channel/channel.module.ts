import { forwardRef, Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelRepository } from '@repository/channel.repository';
import { ChannelSchema } from '@schemas/channel.schema';
import { Channel } from 'diagnostics_channel';
import { CommunityRepository } from '@repository/community.repository';
import { CommunityModule } from '@community/community.module';
import { UserRepository } from '@repository/user.repository';
import { UserModule } from '@user/user.module';
import { ChannelsController } from '@channel/channels.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    forwardRef(() => CommunityModule),
    UserModule,
  ],
  controllers: [ChannelController, ChannelsController],
  providers: [ChannelService, ChannelRepository, CommunityRepository, UserRepository],
  exports: [MongooseModule],
})
export class ChannelModule {}
