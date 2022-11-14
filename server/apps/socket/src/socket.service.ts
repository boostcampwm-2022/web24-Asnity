import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  getHello(): string {
    return 'Hello World!';
  }
}
