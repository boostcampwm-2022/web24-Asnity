export const getChannelBasicInfo = (channel) => {
  return {
    channel_id: channel._id,
    name: channel.name,
    community_id: channel.community_id,
    managerId: channel.managerId,
    description: channel.description,
    profileUrl: channel.profileUrl,
    type: channel.type,
    isPrivate: channel.isPrivate,
    users: channel.users,
    chatLists: channel.chatLists,
    deletedAt: channel.deletedAt,
  };
};