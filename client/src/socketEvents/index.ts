export const SOCKET_EVENTS = {
  JOIN_CHANNEL: 'join',
} as const;

export const joinChannelsPayload = (channelIds: string[]) => ({
  channels: channelIds,
});
