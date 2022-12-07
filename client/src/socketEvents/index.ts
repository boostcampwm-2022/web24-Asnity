export const SOCKET_EVENTS = {
  JOIN_CHANNEL: 'join',
  SEND_CHAT: 'new-message',
  RECEIVE_CHAT: 'new-message',
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
