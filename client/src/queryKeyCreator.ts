const userQueryKey = {
  all: () => ['users'] as const,
  communityUsers: (communityId: string) =>
    [...userQueryKey.all(), { communityId }] as const,
  channelUsers: (channelId: string) =>
    [...userQueryKey.all(), { channelId }] as const,
};

const directMessageQueryKey = {
  all: ['directMessages'] as const,
  list: () => [...directMessageQueryKey.all] as const,
  detail: (id: string) => [...directMessageQueryKey.all, id] as const,
} as const;

const communityQueryKey = {
  all: () => ['communities'] as const,
  createCommunity: () => ['createCommunity'] as const,
  removeCommunity: () => ['removeCommunity'] as const,
  detail: (communityId: string) =>
    [...communityQueryKey.all(), 'detail', communityId] as const,
  leaveCommunity: () => ['leaveCommunity'] as const,
  inviteCommunity: () => ['inviteCommunity'] as const,
};

const channelQueryKey = {
  all: () => ['channels'] as const,
  list: (communityId: string) =>
    [...channelQueryKey.all(), 'list', communityId] as const,
  detail: (channelId: string) =>
    [...channelQueryKey.all(), 'detail', channelId] as const,
  createChannel: () => ['createChannel'] as const,
  leaveChannel: () => ['leaveChannel'] as const,
};

const chatQueryKey = {
  all: () => ['chats'] as const,
  list: (channelId: string) => [...chatQueryKey.all(), { channelId }] as const,
};

const followingQueryKey = {
  all: () => ['followings'] as const,
  toggleFollowing: () => ['toggleFollowing'] as const,
};

const queryKeyCreator = {
  me: () => ['me'] as const,
  signUp: () => ['signUp'] as const,
  signIn: () => ['signIn'] as const,
  signOut: () => ['signOut'] as const,
  followings: followingQueryKey,
  followers: (): [string] => ['followers'],
  reissueToken: () => ['reissueToken'] as const,
  userSearch: (filter: string) => ['userSearch', { filter }],
  directMessage: directMessageQueryKey,
  community: communityQueryKey,
  channel: channelQueryKey,
  user: userQueryKey,
  chat: chatQueryKey,
} as const;

export default queryKeyCreator;

type QueryKeyCreatorType = typeof queryKeyCreator;
export type QueryKeyCreator<T extends keyof QueryKeyCreatorType> =
  QueryKeyCreatorType[T];
