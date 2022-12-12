import type { JoinedChannel } from '@apis/channel';
import type { Chat } from '@apis/chat';
import type { UserUID } from '@apis/user';

export const SOCKET_EVENTS = {
  // ClientToServer
  SEND_CHAT: 'chat',
  EDIT_CHAT: 'chat',
  REMOVE_CHAT: 'chat',
  JOIN_CHANNEL: 'join',
  INVITE_USERS_TO_CHANNEL: 'invite-users-to-channel',

  // ServerToClient
  RECEIVE_CHAT: 'new-chat',
  RECEIVE_REMOVE_CHAT: 'delete-chat',
  RECEIVE_EDIT_CHAT: 'modify-chat',
  INVITED_TO_CHANNEL: 'invited-to-channel',
  INVALID_TOKEN: 'connect_error',
} as const;

export type ClientToServerEventType =
  | typeof SOCKET_EVENTS.JOIN_CHANNEL
  | typeof SOCKET_EVENTS.SEND_CHAT
  | typeof SOCKET_EVENTS.EDIT_CHAT
  | typeof SOCKET_EVENTS.REMOVE_CHAT
  | typeof SOCKET_EVENTS.INVITE_USERS_TO_CHANNEL;
export type ServerToClientEventType =
  | typeof SOCKET_EVENTS.RECEIVE_CHAT
  | typeof SOCKET_EVENTS.RECEIVE_EDIT_CHAT
  | typeof SOCKET_EVENTS.RECEIVE_REMOVE_CHAT
  | typeof SOCKET_EVENTS.INVITED_TO_CHANNEL
  | typeof SOCKET_EVENTS.INVALID_TOKEN;

/* ↓ ↓ ↓ ↓ ↓ Sender ↓ ↓ ↓ ↓ ↓ */

export const CHAT_MUTATION_TYPE = {
  NEW: 'new',
  EDIT: 'modify',
  REMOVE: 'delete',
} as const;

export interface JoinChannelsPayload {
  channels: string[];
}

export interface SendChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.NEW;
  channelId: string;
  content: string;
}

export interface EditChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.EDIT;
  channelId: string;
  chatId: number;
  content: string;
}

export interface RemoveChatPayload {
  chatType: typeof CHAT_MUTATION_TYPE.REMOVE;
  channelId: string;
  chatId: number;
}

/** 소켓 명세에 여기만 snake_case 사용합니다. */
export interface InviteUserToChannelPayload {
  community_id: string;
  channel_id: string;
  users: UserUID[];
}

export interface SocketChatInfo extends Chat {
  channelId: string;
  communityId: string;
}

export interface InvitedToChannelPayload extends JoinedChannel {
  communityId: string;
}

export type ChatMutationEmitCallbackParameter =
  | { written: true; chatInfo: SocketChatInfo }
  | { written: false; chatInfo: undefined };

export type ChatMutationEmitCallback = (
  param: ChatMutationEmitCallbackParameter,
) => void;

export type InviteUserToChannelEmitCallback = ({
  isSuccess,
}: {
  isSuccess: boolean;
}) => void;

/* ↑ ↑ ↑ ↑ ↑ Sender ↑ ↑ ↑ ↑ ↑ */

/* ↓ ↓ ↓ ↓ ↓ Receiver ↓ ↓ ↓ ↓ ↓ */

export interface ReceiveChatPayload extends Chat {
  channelId: string;
  communityId: string;
}

export type ReceiveNewChatListener = (payload: ReceiveChatPayload) => void;
export type ReceiveEditedChatListener = (payload: ReceiveChatPayload) => void;
export type ReceiveRemovedChatListener = (payload: ReceiveChatPayload) => void;
export type InvitedToChannelListener = (
  payload: InvitedToChannelPayload,
) => void;
export type ConnectErrorListener = (err: Error) => void;

export interface ServerToClientEventListener {
  [SOCKET_EVENTS.RECEIVE_CHAT]: ReceiveNewChatListener;
  [SOCKET_EVENTS.RECEIVE_EDIT_CHAT]: ReceiveEditedChatListener;
  [SOCKET_EVENTS.RECEIVE_REMOVE_CHAT]: ReceiveRemovedChatListener;
  [SOCKET_EVENTS.INVITED_TO_CHANNEL]: InvitedToChannelListener;
  [SOCKET_EVENTS.INVALID_TOKEN]: ConnectErrorListener;
}

/* ↑ ↑ ↑ ↑ ↑ Receiver ↑ ↑ ↑ ↑ ↑ */
