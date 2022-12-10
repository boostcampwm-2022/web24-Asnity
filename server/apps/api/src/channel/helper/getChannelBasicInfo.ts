export const getChannelBasicInfo = (channel) => {
  return {
    _id: channel._id,
    name: channel.name,
    communityId: channel.communityId,
    managerId: channel.managerId,
    description: channel.description,
    type: channel.type,
    isPrivate: channel.isPrivate,
    users: channel.users,
    createdAt: channel.createdAt,
    updatedAt: channel.updatedAt,
    lastRead: channel.lastRead,
  };
};
