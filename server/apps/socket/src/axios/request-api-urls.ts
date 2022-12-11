export const storeMessageURL = (channelId) => `/api/channels/${channelId}/chat`;
export const joinChannelInUsersURL = (channelId) => `/api/channels/${channelId}/users`;
export const modifyOrDeleteMessageURL = (channelId, messageId) =>
  `api/channels/${channelId}/chats/${messageId}`;

export const getMessageRequestURL = (data) => {
  if (data.chatType === 'new') return storeMessageURL(data.channelId);
  else if (data.chatType === 'modify' || data.chatType === 'delete')
    return modifyOrDeleteMessageURL(data.channelId, data.messageId);
  else throw Error('Unknown Message Request Type');
};
