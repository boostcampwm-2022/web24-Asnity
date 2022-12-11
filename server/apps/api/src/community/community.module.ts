import { forwardRef, Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from '@schemas/community.schema';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { UserModule } from '@user/user.module';
import { ChannelModule } from '@api/src/channel/channel.module';
import { ChannelRepository } from '@repository/channel.repository';
import { CommunitiesController } from '@community/communities.controller';
import { ChatListRespository } from '@repository/chat-list.respository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),
    UserModule,
    forwardRef(() => ChannelModule),
  ],
  controllers: [CommunityController, CommunitiesController],
  providers: [
    CommunityService,
    CommunityRepository,
    UserRepository,
    ChannelRepository,
    ChatListRespository,
  ],
  exports: [MongooseModule],
})
export class CommunityModule {}
