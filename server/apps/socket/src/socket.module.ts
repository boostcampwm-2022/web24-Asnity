import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatListRespository } from '@repository/chat-list.respository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/${process.env.NODE_ENV}.env`,
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [],
  providers: [SocketGateway],
})
export class SocketModule {}
