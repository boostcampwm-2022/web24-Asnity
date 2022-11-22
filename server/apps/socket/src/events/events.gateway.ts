import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8001, {
  namespace: /\/commu-.+/,
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Socket');

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('events') // socket.on('events', ({}) => {})
  handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket): string {
    const namespace = socket.nsp;
    const namespaceName = socket.nsp.name;
    return data;
  }

  afterInit(server: Server) {
    // 서버 실행 시 실행되는 함수
    // this.logger.log('Init');
  }

  handleDisconnect(socket: Socket) {
    // client의 disconnect event
    // this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(socket: Socket, ...args: any[]) {
    // client의 connect event
    // this.logger.log(`Client Connected : ${client.id}`);
  }
}
