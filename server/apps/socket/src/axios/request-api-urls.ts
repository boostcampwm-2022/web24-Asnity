export const storeMessageURL = (channelId) => `/api/channels/${channelId}/message`;
export const joinChannelInUsersURL = (channelId) => `/api/channels/${channelId}/users`;
export const modifyMessageURL = (channelId, messageId) =>
  `api/channels/${channelId}/message/${messageId}`;
