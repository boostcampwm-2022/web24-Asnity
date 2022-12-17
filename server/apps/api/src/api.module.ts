import { CacheModule, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from '@channel/channel.module';
import { CommunityModule } from '@community/community.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { ChatListModule } from '@chat-list/chat-list.module';
import { mongoDbServerModule } from '@api/modules/mongo-server.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { importConfigModule } from '@api/modules/Config.module';
import { importRedisModule } from '@api/modules/Redis.module';
// import { RedisModule } from '@api/modules/redis/Redis.module';

@Module({
  imports: [
    importConfigModule(),
    process.env.NODE_ENV != 'test'
      ? MongooseModule.forRoot(process.env.MONGODB_URL)
      : mongoDbServerModule(),
    importRedisModule(),
    importWinstonModule(),
    UserModule,
    ChannelModule,
    CommunityModule,
    AuthModule,
    ChatListModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
