import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from '@schemas/community.schema';
import { CommunityRepository } from '@repository/community.repository';
import { UserRepository } from '@repository/user.repository';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),
    UserModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, UserRepository],
})
export class CommunityModule {}
