const endPoint = {
  signUp: () => `/api/user/auth/signup` as const,
  signIn: () => `/api/user/auth/signin` as const,
  signOut: () => `/api/user/auth/signout` as const,
  reissueToken: () => `/api/user/auth/refresh` as const,
  createChannel: () => `/api/channel` as const,
  getChannel: (channelId: string) => `/api/channels/${channelId}` as const,
  inviteChannel: (channelId: string) =>
    `/api/channels/${channelId}/users` as const,
  leaveChannel: (channelId: string) => `/api/channels/${channelId}/me` as const,
  getCommunities: () => `/api/communities` as const,
  createCommunity: () => `/api/community` as const,
  removeCommunity: (communityId: string) =>
    `/api/communities/${communityId}` as const,
  leaveCommunity: (communityId: string) =>
    `/api/communities/${communityId}/me` as const,
  inviteCommunity: (communityId: string) =>
    `/api/communities/${communityId}/users` as const,
  getMyInfo: () => `/api/user/auth/me` as const,
  getFollowings: () => `/api/user/followings` as const,
  getFollowers: () => `/api/user/followers` as const,
  toggleFollowing: (userId: string) => `/api/user/following/${userId}` as const,
  getUsers: () => `/api/users`, // 사용할 때는 queryString 추가 전달 필요합니다 as const.
  getCommunityUsers: (communityId: string) =>
    `/api/communities/${communityId}/users` as const,
  getChats: (channelId: string) => `/api/channels/${channelId}/message`,
  updateLastRead: (channelId: string) => `/api/channels/${channelId}/lastRead`,
} as const;

export default endPoint;
