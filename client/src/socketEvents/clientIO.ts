import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

import { SOCKET_URL } from '@constants/url';
import { io } from 'socket.io-client';

import { joinChannelsPayload, SOCKET_EVENTS } from '@/socketEvents/index';

interface ClientIOConstructor {
  communityId: string;
  opts?: Partial<ManagerOptions & SocketOptions> | undefined;
}

export default class ClientIO {
  private io: Socket;

  static createOpts({ token }: { token: string }) {
    return {
      auth: { token: `Bearer ${token}` },
    };
  }

  constructor({ communityId, opts }: ClientIOConstructor) {
    this.io = io(`${SOCKET_URL}/socket/commu-${communityId}`, opts);
  }

  on<T extends (...params: unknown[]) => unknown>(
    eventName: string,
    handler: T,
  ) {
    this.io.on(eventName, handler);
  }

  off(eventName: string) {
    this.io.off(eventName);
  }

  emit<T, C extends (...params: unknown[]) => unknown | undefined>(
    eventName: string,
    payload?: T,
    emitCallback?: C,
  ) {
    this.io.emit(eventName, payload, emitCallback);
  }

  joinChannels(communityIds: string[]) {
    this.emit(SOCKET_EVENTS.JOIN_CHANNEL, joinChannelsPayload(communityIds));
  }

  sendChat() {
    this.emit(SOCKET_EVENTS.SEND_CHAT);
  }

  editChat() {}

  removeChat() {}

  inviteUsersToChannel() {}
}
