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
import { ChatListModule } from '@chat-list/chat-list.module';
import { ChatListRespository } from '@repository/chat-list.respository';
import { BotService } from '@channel/bot.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    forwardRef(() => CommunityModule),
    UserModule,
    forwardRef(() => ChatListModule),
  ],
  controllers: [ChannelController, ChannelsController],
  providers: [
    ChannelService,
    ChannelRepository,
    CommunityRepository,
    UserRepository,
    ChatListRespository,
    BotService,
  ],
  exports: [MongooseModule],
})
export class ChannelModule {}
