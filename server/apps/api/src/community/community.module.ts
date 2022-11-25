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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),
    UserModule,
    forwardRef(() => ChannelModule),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, UserRepository, ChannelRepository],
  exports: [MongooseModule],
})
export class CommunityModule {}
