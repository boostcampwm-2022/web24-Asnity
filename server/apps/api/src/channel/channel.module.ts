import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    CommunityModule,
    UserModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository, CommunityRepository, UserRepository],
})
export class ChannelModule {}
