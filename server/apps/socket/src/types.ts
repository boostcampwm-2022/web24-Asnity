import { Socket } from 'socket.io';

interface JwtToken {
  user: {
    _id: string;
    nickname: string;
    accessToken: string;
  };
}
export type SocketWithAuth = Socket & JwtToken;
