import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway],
})
export class SocketModule {}
