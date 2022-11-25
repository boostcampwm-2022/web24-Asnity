export const getChannelBasicInfo = (channel) => {
  return {
    _id: channel._id,
    name: channel.name,
    managerId: channel.managerId,
    type: channel.type,
    isPrivate: channel.isPrivate,
    profileUrl: channel.profileUrl,
    description: channel.description,
  };
};
