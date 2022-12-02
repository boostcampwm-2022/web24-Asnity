import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from '@channel/channel.module';
import { CommunityModule } from '@community/community.module';
import { UserModule } from '@user/user.module';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { AuthModule } from '@auth/auth.module';
import { ChatListModule } from '@chat-list/chat-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Asnity', { prettyPrint: true }),
          ),
        }),
      ],
    }),
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
