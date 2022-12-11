import type {
  EditChatPayload,
  RemoveChatPayload,
  SendChatPayload,
  ChatMutationEmitCallback,
  JoinChannelsPayload,
  InviteUserToChannelPayload,
} from '@/socketEvents/clientIO.type';
import type { SOCKET_RECEIVE_EVENT_TYPE } from '@/socketEvents/index';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

import { SOCKET_URL } from '@constants/url';
import { io } from 'socket.io-client';

import { CHAT_MUTATION_TYPE } from '@/socketEvents/clientIO.type';
import { SOCKET_EVENTS } from '@/socketEvents/index';

const createConnectionUrl = (communityId: string) =>
  `${SOCKET_URL}/socket/commu-${communityId}`;

interface ClientIOConstructor {
  communityId: string;
  opts?: Partial<ManagerOptions & SocketOptions> | undefined;
}

export default class ClientIO {
  private io: Socket;

  static createOpts({ token }: { token: string }) {
    return { auth: { token: `Bearer ${token}` } };
  }

  // 예시: const socket = new ClientIO({ communityId, ClientIO.createOpts({ token }) });
  constructor({ communityId, opts }: ClientIOConstructor) {
    this.io = io(createConnectionUrl(communityId), opts);
  }

  // socket.on 메서드 파라미터 타이핑이 any[]로 되어있어서 never[] 사용할 수 없음.
  on<E extends SOCKET_RECEIVE_EVENT_TYPE>(eventName: E, handler: any) {
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

  /** 서버 Room에 소켓 등록하기 위한 메서드 */
  joinChannels(channelIds: string[]) {
    this.emit<JoinChannelsPayload, never>(SOCKET_EVENTS.JOIN_CHANNEL, {
      channels: channelIds,
    });
  }

  sendChat(
    payload: Omit<SendChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<SendChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.SEND_CHAT,
      { ...payload, chatType: CHAT_MUTATION_TYPE.NEW },
      emitCallback,
    );
  }

  editChat(
    payload: Omit<EditChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<EditChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.EDIT_CHAT,
      { ...payload, chatType: CHAT_MUTATION_TYPE.EDIT },
      emitCallback,
    );
  }

  removeChat(
    payload: Omit<RemoveChatPayload, 'chatType'>,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<RemoveChatPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.REMOVE_CHAT,
      { ...payload, chatType: CHAT_MUTATION_TYPE.REMOVE },
      emitCallback,
    );
  }

  inviteUsersToChannel(
    payload: InviteUserToChannelPayload,
    emitCallback: ChatMutationEmitCallback,
  ) {
    this.emit<InviteUserToChannelPayload, ChatMutationEmitCallback>(
      SOCKET_EVENTS.INVITE_USERS_TO_CHANNEL,
      payload,
      emitCallback,
    );
  }
}
