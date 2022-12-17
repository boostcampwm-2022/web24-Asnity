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
  private communityId: string;

  static joinedChannels: Record<string, string[] | undefined> = {};
  static createOpts({ token }: { token: string }) {
    return { auth: { token: `Bearer ${token}` } };
  }

  constructor({ communityId, opts }: ClientIOConstructor) {
    this.communityId = communityId;
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

  /**
   * ### 서버 Room에 소켓 등록하기 위한 메서드
   * - 서버에서 room을 set으로 관리하기 때문에, 전체 채널 join요청을 보내도 상관 X (등록된 채널을 중복해서 요청해도 된다.)
   * - 따라서 채널을 하나씩 비교하지 않고, `queryClient`에서 관리하는 스토어에서의 채널 개수와,
   * `ClientIO`에서 관리하는 스토어에서의 채널 개수가 다른지만 비교한 뒤 다르다면 요청한다.
   * - 요청을 보내면 즉시 `queryClient`의 채널 정보와 `ClientIO`의 채널 정보를 동기화한다.
   */
  joinChannels(channelIds: string[]) {
    const { communityId } = this;
    const target = ClientIO.joinedChannels[communityId];

    if (target === undefined || target.length !== channelIds.length) {
      ClientIO.joinedChannels[communityId] = channelIds;
      this.emit<JoinChannelsPayload, never>(SOCKET_EVENTS.JOIN_CHANNEL, {
        channels: channelIds,
      });
    }
  }

  leaveChannel(channelId: string) {
    const { communityId } = this;

    ClientIO.joinedChannels[communityId] = ClientIO.joinedChannels[
      communityId
    ]?.filter((_channelId) => _channelId !== channelId);
    /** 필요하다면, 여기서 서버에 채널 join을 해제하는 emit을 보낼 수 있다. */
  }

  leaveCommunity() {
    const { communityId } = this;

    /** 필요하다면, 여기서 서버에 채널 join을 해제하는 emit을 보낼 수 있다. */
    ClientIO.joinedChannels[communityId] = undefined;
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
