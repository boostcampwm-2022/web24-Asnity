import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ChannelModule } from '@channel/channel.module';
import { CommunityModule } from '@community/community.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { ChatListModule } from '@chat-list/chat-list.module';
import { mongoDbRealServerModule, mongoDbServerModule } from '@api/modules/mongo-server.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { importConfigModule } from '@api/modules/Config.module';
import { importRedisModule } from '@api/modules/Redis.module';

@Module({
  imports: [
    importConfigModule(),
    process.env.NODE_ENV != 'test' ? mongoDbRealServerModule() : mongoDbServerModule(),
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
