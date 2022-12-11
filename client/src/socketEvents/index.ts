// TODO: 대부분 ClientIO.type.ts로 옮길 예정
import type { JoinedChannel } from '@apis/channel';
import type { Chat } from '@apis/chat';
import type { CommunitySummary } from '@apis/community';
import type { User } from '@apis/user';

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

export const joinChannelsPayload = (channelIds: string[]) => ({
  channels: channelIds,
});

export interface SendChatPayloadParameter {
  id: number;
  channelId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export const sendChatPayload = ({
  id,
  channelId,
  senderId,
  content,
  createdAt,
}: SendChatPayloadParameter) => ({
  id,
  type: 'new',
  channelId,
  user_id: senderId,
  message: content,
  time: createdAt,
});

export interface ReceiveChatPayload {
  id: number;
  channelId: string;
  user_id: string;
  message: string;
  time: Date;
}

export type ReceiveChatHandler = ({
  id,
  channelId,
  user_id,
  message,
  time,
}: ReceiveChatPayload) => void;

export interface EditChatPayloadParameter {
  id: number;
  channelId: string;
  content: string;
}

export const editChatPayload = ({
  id,
  channelId,
  content,
}: EditChatPayloadParameter) => ({
  messageId: id,
  type: 'modify',
  channelId,
  message: content,
});

export interface ReceiveEditChatHandlerParameter {
  updatedChat: Chat;
  channelId: string;
}

export type ReceiveEditChatHandler = ({
  updatedChat,
  channelId,
}: ReceiveEditChatHandlerParameter) => void;

/* ======================= [ 채널 초대 보내기 ] ====================== */
export interface InviteUsersToChannelPayloadParameter {
  communityId: string;
  channelId: string;
  users: Array<User['_id']>;
}

export const inviteUsersToChannelPayload = ({
  communityId,
  channelId,
  users,
}: InviteUsersToChannelPayloadParameter) => ({
  community_id: communityId,
  channel_id: channelId,
  users,
});

export interface InviteUsersToChannelResponse {
  isSuccess: boolean;
}
export type InviteUsersToChannelCallback = (
  response: InviteUsersToChannelResponse,
) => void;

/* ======================= [ 채널 초대 받음 ] ====================== */
export interface InvitedToChannelPayload extends JoinedChannel {
  communityId: CommunitySummary['_id'];
}
export type InvitedToChannelHandler = (
  payload: InvitedToChannelPayload,
) => void;
