import type {
  EditChatPayload,
  RemoveChatPayload,
  SendChatPayload,
  ChatMutationEmitCallback,
} from '@/socketEvents/clientIO.type';
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

  // 예시: const socket = new ClientIO({ communityId, ClientIO.createOpts({ token }) });
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

  emit<T, C extends (...params: never[]) => void | undefined>(
    eventName: string,
    payload?: T,
    emitCallback?: C,
  ) {
    this.io.emit(eventName, payload, emitCallback);
  }

  joinChannels(communityIds: string[]) {
    this.emit(SOCKET_EVENTS.JOIN_CHANNEL, joinChannelsPayload(communityIds));
  }

  sendChat(
    payload: Omit<SendChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<SendChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.SEND_CHAT,
      { ...payload, chatType: 'new' },
      emitCallback,
    );
  }

  editChat(
    payload: Omit<EditChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<EditChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.EDIT_CHAT,
      {
        ...payload,
        chatType: 'modify',
      },
      emitCallback,
    );
  }

  removeChat(
    payload: Omit<RemoveChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<RemoveChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.REMOVE_CHAT,
      { ...payload, chatType: 'delete' },
      emitCallback,
    );
  }

  inviteUsersToChannel() {
    this.emit(SOCKET_EVENTS.INVITE_USERS_TO_CHANNEL);
  }
}
