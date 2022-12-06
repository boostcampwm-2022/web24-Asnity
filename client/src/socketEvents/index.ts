export const SOCKET_EVENTS = {
  JOIN_CHANNEL: 'join',
  SEND_CHAT: 'new-message',
} as const;

export const joinChannelsPayload = (channelIds: string[]) => ({
  channels: channelIds,
});

export interface SendChannelPayloadParameter {
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
}: SendChannelPayloadParameter) => ({
  id,
  channelId,
  user_id: senderId,
  message: content,
  time: createdAt,
});
