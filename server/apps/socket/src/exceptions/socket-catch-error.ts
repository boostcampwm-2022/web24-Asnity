import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { SocketWithAuth } from '../types';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsCatchAllFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    // super.catch(exception, host);
    const socket: SocketWithAuth = host.switchToWs().getClient();
    const message = exception['message'] ?? exception ?? exception.name ?? '에러 발생';
    socket.emit('failed-to-send-message', { message });
  }
}
