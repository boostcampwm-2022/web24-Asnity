export const storeMessageURL = (channelId) => `/api/channels/${channelId}/chat`;
export const joinChannelInUsersURL = (channelId) => `/api/channels/${channelId}/users`;
export const modifyOrDeleteMessageURL = (channelId, messageId) =>
  `api/channels/${channelId}/chats/${messageId}`;

export const getMessageRequestURL = (data) => {
  if (data.type == 'new') return storeMessageURL(data.channelId);
  else if (data.type == 'modify' || data.type == 'delete')
    return modifyOrDeleteMessageURL(data.channelId, data.messageId);
  else throw Error('Unknown Message Request Type');
};
