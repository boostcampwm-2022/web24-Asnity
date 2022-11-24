export const makeCommunityObj = (community_id: string) => {
  const newCommunity = {};
  newCommunity[`communities.${community_id}`] = {
    _id: community_id,
    channels: {},
  };
  return newCommunity;
};
