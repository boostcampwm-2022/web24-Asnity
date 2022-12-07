import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException, UseFilters } from '@nestjs/common';
import { Join, NewMessage, ModifyMessage } from '@socketInterface/index';
import { SocketWithAuth } from './types';
import { JwtService } from '@nestjs/jwt';
import { WsCatchAllFilter } from './exceptions/socket-catch-error';
//TODO : revers proxy : https://socket.io/docs/v4/reverse-proxy/

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: /.+/,
  cors: {
    origin: '*', //['http://localhost:80'],
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Socket');

  @SubscribeMessage('join') // socket.on('join', ({}) => {})
  joinEvent(@MessageBody() data: Join, @ConnectedSocket() socket: SocketWithAuth) {
    // console.log(socket.handshake.headers);
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
  newMessageEvent(@MessageBody() data: NewMessage, @ConnectedSocket() socket: SocketWithAuth) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { id, channelId, user_id, message, time } = data;
    this.logger.log(
      `new message : \n\tns : ${communityName}\n\tchannel : ${channelId}\n\tFrom ${user_id}: [${time}] ${message}`,
    );
    console.log(socket.user);
    // community.emit('new-message', { message: message }); // community에 전체 broad casting
    community.to(channelId).emit('new-message', data);
  }

  @SubscribeMessage('modify-message')
  modifyMessageEvent(
    @MessageBody() data: ModifyMessage,
    @ConnectedSocket() socket: SocketWithAuth,
  ) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { channelId, user_id, message, messageId } = data;
    this.logger.log(
      `modify message : \n\tns : ${communityName}\n\tchannel : ${channelId}\n\tFrom ${user_id}: ${message}\n\torigin id : ${messageId}`,
    );
    community.to(channelId).emit('modify-message', data);
    // TODO : db에 message data 수정을 여기서할지 논의하기
  }

  afterInit(server: Server) {
    // 서버 실행 시 실행되는 함수
    this.logger.log('웹소켓 서버 실행 시작');
    this.server.use(createTokenMiddleware(this.jwtService));
  }

  handleDisconnect(socket: SocketWithAuth) {
    // client의 disconnect event
    this.logger.log(`Client Disconnected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }

  handleConnection(socket: SocketWithAuth, ...args: any[]) {
    // client의 connect event
    this.logger.log(`Client Connected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }
}

const createTokenMiddleware = (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['token'];

  try {
    const payload = jwtService.verify(token.split(' ')[1]);
    socket.user = { _id: payload._id, nickname: payload.nickname };
    next();
  } catch (error) {
    next(new WsException('Unauthorized'));
  }
};
