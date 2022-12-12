import type {
  EditChatPayload,
  RemoveChatPayload,
  SendChatPayload,
  ChatMutationEmitCallback,
  JoinChannelsPayload,
  InviteUserToChannelPayload,
  ServerToClientEventListener,
  InviteUserToChannelEmitCallback,
  ServerToClientEventType,
  ClientToServerEventType,
} from '@sockets/ClientIOTypes';
import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

import { SOCKET_URL } from '@constants/url';
import { CHAT_MUTATION_TYPE, SOCKET_EVENTS } from '@sockets/ClientIOTypes';
import { io } from 'socket.io-client';

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

  isConnected() {
    return this.io.connected;
  }

  on<E extends ServerToClientEventType>(
    eventName: E,
    handler: ServerToClientEventListener[E],
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.io.on(eventName, handler);
  }

  off<E extends ServerToClientEventType>(eventName: E) {
    this.io.off(eventName);
  }

  private emit<P, C extends (...params: never[]) => void | undefined>(
    eventName: ClientToServerEventType,
    payload?: P,
    emitCallback?: C,
  ) {
    /** socket emit message 3번째에 null 들어가는 이슈 */
    if (emitCallback) {
      this.io.emit(eventName, payload, emitCallback);
      return;
    }

    this.io.emit(eventName, payload);
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
    emitCallback: InviteUserToChannelEmitCallback,
  ) {
    this.emit<InviteUserToChannelPayload, InviteUserToChannelEmitCallback>(
      SOCKET_EVENTS.INVITE_USERS_TO_CHANNEL,
      payload,
      emitCallback,
    );
  }

  disconnect() {
    this.io.disconnect();
  }
}
