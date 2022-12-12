import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { SocketWithAuth } from '../types';

export const authMiddleware = (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers['token'];

  try {
    const accessToken = token.split(' ')[1];
    const payload = jwtService.verify(accessToken);
    socket.user = {
      _id: payload._id,
      nickname: payload.nickname,
      accessToken,
    };
    next();
  } catch (error) {
    next(new WsException('Unauthorized'));
  }
};
