export const IsUserInCommunity = (user, communityId) =>
  (user.communities ?? false) && Array.from(user.communities.keys()).includes(communityId);
