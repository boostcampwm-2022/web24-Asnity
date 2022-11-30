const endPoint = {
  signUp: () => `/api/user/auth/signup`,
  signIn: () => `/api/user/auth/signin`,
  reissueToken: () => `/api/user/auth/refresh`,
  createChannel: () => `/api/channel`,
  getChannel: (channelId: string) => `/api/channels/${channelId}`,
  getCommunities: () => `/api/communities`,
  createCommunity: () => `/api/community`,
  removeCommunity: (communityId: string) => `/api/communities/${communityId}`,
  leaveCommunity: (communityId: string) => `/api/communities/${communityId}/me`,
  inviteCommunity: (communityId: string) =>
    `/api/communities/${communityId}/users`,
  getMyInfo: () => `/api/user/auth/me`,
  getFollowings: () => `/api/user/followings`,
  getFollowers: () => `/api/user/followers`,
  toggleFollowing: (userId: string) => `/api/user/following/${userId}`,
  getUsers: () => `/api/users`, // 사용할 때는 queryString 추가 전달 필요합니다.
  getCommunityUsers: (communityId: string) =>
    `/api/communities/${communityId}/users`,
};

export default endPoint;
