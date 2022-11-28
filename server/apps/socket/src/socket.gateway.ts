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

@WebSocketGateway(8081, {
  namespace: /\/commu-.+/,
  cors: {
    origin: '*', //['http://localhost:80'],
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Socket');

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join') // socket.on('join', ({}) => {})
  joinEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const namespace = socket.nsp;
    const namespaceName = socket.nsp.name;
    console.log(
      `new client join from ${namespaceName} namespace and channel info : ${data.channel}`,
    );
    // channel 별로 join 하는 로직 필요
    // return data;
  }

  @SubscribeMessage('new-message') // socket.on('new-message', ({}) => {})
  newMessageEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    const namespace = socket.nsp;
    const namespaceName = socket.nsp.name;
    console.log(`new message from ${namespaceName} namespace and message : ${data.message}`);
    namespace.emit('new-message', { message: data.message });
    // return data;
  }

  afterInit(server: Server) {
    // 서버 실행 시 실행되는 함수
    this.logger.log('웹소켓 서버 실행 시작');
  }

  handleDisconnect(socket: Socket) {
    // client의 disconnect event
    // this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(socket: Socket, ...args: any[]) {
    // client의 connect event
    this.logger.log(`Client Connected : ${socket.id} ns : ${socket.nsp.name}`);
  }
}
