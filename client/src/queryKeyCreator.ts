const userQueryKey = {
  all: () => ['users'] as const,
  list: (filter: string) => [...userQueryKey.all(), { filter }],
  communityUsers: (communityId: string) =>
    [...userQueryKey.all(), { communityId }] as const,
};

const followingQueryKey = {
  all: () => ['followings'] as const,
  list: () => [...followingQueryKey.all(), 'list'] as const,
  toggleFollowing: () => ['toggleFollowing'] as const,
};

const followerQueryKey = {
  all: () => ['followers'] as const,
  list: () => [...followerQueryKey.all(), 'list'] as const,
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
  leaveChannel: () => ['leaveChannel'] as const,
  inviteChannel: () => ['inviteChannel'] as const,
  updateLastRead: () => ['updateLastRead'] as const,
};

const chatQueryKey = {
  all: () => ['chats'] as const,
  list: (channelId: string) => [...chatQueryKey.all(), channelId] as const,
  unreadChatId: (channelId: string) =>
    [...chatQueryKey.all(), 'unread-chat-id', channelId] as const,
};

const queryKeyCreator = {
  me: () => ['me'] as const,
  signUp: () => ['signUp'] as const,
  signIn: () => ['signIn'] as const,
  signOut: () => ['signOut'] as const,
  reissueToken: () => ['reissueToken'] as const,
  user: userQueryKey,
  following: followingQueryKey,
  follower: followerQueryKey,
  directMessage: directMessageQueryKey,
  community: communityQueryKey,
  channel: channelQueryKey,
  chat: chatQueryKey,
} as const;

export default queryKeyCreator;

type QueryKeyCreatorType = typeof queryKeyCreator;
export type QueryKeyCreator<T extends keyof QueryKeyCreatorType> =
  QueryKeyCreatorType[T];
