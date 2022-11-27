export const getCommunityBasicInfo = (community, channels) => {
  return {
    _id: community._id,
    name: community.name,
    managerId: community.managerId,
    profileUrl: community.profileUrl,
    description: community.description,
    channels,
  };
};
