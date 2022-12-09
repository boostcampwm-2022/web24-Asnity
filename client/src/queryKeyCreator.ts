const userQueryKey = {
  all: () => ['users'] as const,
  list: (filter: string) => [...userQueryKey.all(), { filter }],
  communityUsers: (communityId: string) =>
    [...userQueryKey.all(), { communityId }] as const,
};

const directMessageQueryKey = {
  all: ['directMessages'] as const,
  list: () => [...directMessageQueryKey.all] as const,
  detail: (id: string) => [...directMessageQueryKey.all, id] as const,
} as const;

const communityQueryKey = {
  all: () => ['communities'] as const,
  list: () => [...communityQueryKey.all(), 'list'] as const,
  createCommunity: () => ['createCommunity'] as const,
  removeCommunity: () => ['removeCommunity'] as const,
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
  inviteChannel: () => ['inviteChannel'] as const,
  leaveChannel: () => ['leaveChannel'] as const,
};

const chatQueryKey = {
  all: () => ['chats'] as const,
  list: (channelId: string) => [...chatQueryKey.all(), channelId] as const,
};

const followingQueryKey = {
  all: () => ['followings'] as const,
  list: () => [...followingQueryKey.all(), 'list'] as const,
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
