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
import { Server } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { Join, NewMessage, ModifyMessage, InviteChannel } from '@socketInterface/index';
import { SocketWithAuth } from './types';
import { JwtService } from '@nestjs/jwt';
import { WsCatchAllFilter } from './exceptions/socket-catch-error';
import { RestoreMessageDto } from '@chat-list/dto';
import { requestApiServer } from './axios/request-api-server';
import { joinChannelInUsersURL, storeMessageURL } from './axios/request-api-urls';
import { authMiddleware } from './middleware/authMiddleware';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: /\/socket\/commu-.+/,
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('Socket');

  @SubscribeMessage('join')
  joinEvent(@MessageBody() data: Join, @ConnectedSocket() socket: SocketWithAuth) {
    const community = socket.nsp;
    const communityName = socket.nsp.name;
    const { channels } = data;
    // channel 별로 join 하는 로직
    community.socketsJoin(channels);
    this.logger.log(
      `This socket which ns is '${communityName}' join rooms : ` + Array.from(socket.rooms),
    );
  }

  @SubscribeMessage('new-message')
  async newMessageEvent(
    @MessageBody() data: NewMessage,
    @ConnectedSocket() socket: SocketWithAuth,
  ) {
    const communityName = socket.nsp.name;
    const { id, channelId, user_id, message, time } = data;
    this.logger.log(
      `New message.\t[NS] : ${communityName},\t[channel] : ${channelId}\t[From] ${user_id},\t[MSG][${time}]:${message}`,
    );
    const restoreMessageDto: RestoreMessageDto = {
      channel_id: channelId,
      type: 'TEXT',
      content: message,
      senderId: socket.user._id,
    };
    const result = await requestApiServer({
      method: 'post',
      path: storeMessageURL(channelId),
      accessToken: socket.user.accessToken,
      data: restoreMessageDto,
    });
    if (result) {
      socket.to(channelId).emit('new-message', data);
    }

    const written = result;
    return { written };
  }

  @SubscribeMessage('invite-users-to-channel')
  async inviteChannel(
    @MessageBody() data: InviteChannel,
    @ConnectedSocket() socket: SocketWithAuth,
  ) {
    const communityName = socket.nsp.name;
    const { channel_id, users } = data;
    this.logger.log(
      `Invite Users to Channel.\t[NS] : ${communityName},\t[channel] : ${channel_id}\t[users] ${users}`,
    );

    const result = await requestApiServer({
      method: 'post',
      path: joinChannelInUsersURL(channel_id),
      accessToken: socket.user.accessToken,
      data,
    });
    if (result) {
      Array.from(socket.nsp.sockets.values()).forEach((otherSocket: SocketWithAuth) => {
        if (users.includes(otherSocket.user._id)) {
          otherSocket.join(channel_id);
          otherSocket.emit('invited-to-channel', result);
        }
      });
    }

    const isSuccess = result ? true : false;
    return { isSuccess };
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
      `Modify message.\t[NS] : ${communityName},\t[channel] : ${channelId}\t[From] ${user_id},\t[MSG] : ${message},\t[Origin id] : ${messageId}`,
    );
    community.to(channelId).emit('modify-message', data);
    // TODO : db에 message data 수정을 여기서할지 논의하기
  }

  afterInit(server: Server) {
    // 서버 실행 시 실행되는 함수
    this.logger.log('웹소켓 서버 실행 시작');
    this.server.use(authMiddleware(this.jwtService));
  }

  handleDisconnect(socket: SocketWithAuth) {
    // client의 disconnect event
    this.logger.log(`Client Disconnected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }

  handleConnection(socket: SocketWithAuth) {
    // client의 connect event
    this.logger.log(`Client Connected : [NS] '${socket.nsp.name}', [ID] ${socket.id}`);
  }
}
