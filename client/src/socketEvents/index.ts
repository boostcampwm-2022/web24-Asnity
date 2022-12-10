import type { JoinedChannel } from '@apis/channel';
import type { CommunitySummary } from '@apis/community';
import type { User } from '@apis/user';

export const SOCKET_EVENTS = {
  JOIN_CHANNEL: 'join',
  SEND_CHAT: 'new-message',
  RECEIVE_CHAT: 'new-message',
  INVALID_TOKEN: 'connect_error',
  INVITE_USERS_TO_CHANNEL: 'invite-users-to-channel',
  INVITED_TO_CHANNEL: 'invited-to-channel',
} as const;

export const joinChannelsPayload = (channelIds: string[]) => ({
  channels: channelIds,
});

export interface SendChatPayloadParameter {
  id: string;
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
  channelId,
  user_id: senderId,
  message: content,
  time: createdAt,
});

export interface ReceiveChatPayload {
  id: string;
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
