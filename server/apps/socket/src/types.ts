import { Socket } from 'socket.io';

interface JwtToken {
  user: {
    _id: string;
    nickname: string;
  };
  unAuthorized?: boolean;
}
export type SocketWithAuth = Socket & JwtToken;
