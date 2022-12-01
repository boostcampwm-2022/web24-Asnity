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
import { Join, NewMessage, ModifyMessage } from '@socketInterface/index';
//TODO : revers proxy : https://socket.io/docs/v4/reverse-proxy/

@WebSocketGateway({
  namespace: /\/socket\/commu-.+/,
  cors: {
    origin: '*', //['http://localhost:80'],
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Socket');

  @SubscribeMessage('join') // socket.on('join', ({}) => {})
  joinEvent(@MessageBody() data: Join, @ConnectedSocket() socket: Socket) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { channels } = data;
    // channel 별로 join 하는 로직
    community.socketsJoin(channels);
    console.log(
      `This socket which ns is '${communityName}' join rooms : ` + Array.from(socket.rooms),
    );
  }

  @SubscribeMessage('new-message') // socket.on('new-message', ({}) => {})
  newMessageEvent(@MessageBody() data: NewMessage, @ConnectedSocket() socket: Socket) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { channelId, user_id, message, time } = data;
    console.log(
      `new message : \n\tns : ${communityName}\n\tchannel : ${channelId}\n\tFrom ${user_id}: [${time}] ${message}`,
    );
    // community.emit('new-message', { message: message }); // community에 전체 broad casting
    community.to(channelId).emit('new-message', data);
  }

  @SubscribeMessage('modify-message')
  modifyMessageEvent(@MessageBody() data: ModifyMessage, @ConnectedSocket() socket: Socket) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { channelId, user_id, message, messageId } = data;
    console.log(
      `modify message : \n\tns : ${communityName}\n\tchannel : ${channelId}\n\tFrom ${user_id}: ${message}\n\torigin id : ${messageId}`,
    );
    community.to(channelId).emit('modify-message', data);
    // TODO : db에 message data 수정을 여기서할지 논의하기
  }

  afterInit(server: Server) {
    // 서버 실행 시 실행되는 함수
    this.logger.log('웹소켓 서버 실행 시작');
  }

  async handleDisconnect(socket: Socket) {
    // client의 disconnect event
    this.logger.log(`Client Disconnected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }

  handleConnection(socket: Socket, ...args: any[]) {
    // client의 connect event
    this.logger.log(`Client Connected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }
}