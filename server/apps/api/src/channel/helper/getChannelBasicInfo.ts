export const getChannelBasicInfo = (channel) => {
  return {
    _id: channel._id,
    name: channel.name,
    community_id: channel.community_id,
    managerId: channel.managerId,
    description: channel.description,
    type: channel.type,
    isPrivate: channel.isPrivate,
    users: channel.users,
    createdAt: channel.createdAt,
    deletedAt: channel.deletedAt,
    lastRead: channel.lastRead,
  };
};
