import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common';
import { SocketWithAuth } from '../types';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsCatchAllFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();
    console.log('catch err');
    // if (exception instanceof UnauthorizedException) {
    //
    //   const message = exceptionData['message'] ?? exceptionData ?? exception.name;
    // }
    // const exceptionData = exception.getResponse();
    const message = exception['message'] ?? exception ?? exception.name;
    socket.emit('failed-to-send-message', message);
  }
}
