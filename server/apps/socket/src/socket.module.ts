import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [SocketController],
  providers: [SocketService],
})
export class SocketModule {}
