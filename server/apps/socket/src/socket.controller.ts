import { Controller, Get } from '@nestjs/common';
import { SocketService } from './socket.service';

@Controller()
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get()
  getHello(): string {
    return this.socketService.getHello();
  }
}
