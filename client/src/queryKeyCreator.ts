const directMessageQueryKey = {
  all: ['directMessages'] as const,
  list: () => [...directMessageQueryKey.all] as const,
  detail: (id: string) => [...directMessageQueryKey.all, id] as const,
} as const;

const communityQueryKey = {
  all: () => ['communities'] as const,
  createCommunity: () => ['createCommunity'] as const,
};

const channelQueryKey = {
  all: () => ['channels'] as const,
  list: (communityId: string) =>
    [...channelQueryKey.all(), communityId] as const,
};

const queryKeyCreator = {
  me: () => ['me'] as const,
  signUp: () => ['signUp'] as const,
  signIn: () => ['signIn'] as const,
  followings: (): [string] => ['followings'],
  followers: (): [string] => ['followers'],
  reissueToken: () => ['reissueToken'] as const,
  userSearch: (filter: string) => ['userSearch', { filter }],
  directMessage: directMessageQueryKey,
  community: communityQueryKey,
  channel: channelQueryKey,
} as const;

export default queryKeyCreator;

type QueryKeyCreatorType = typeof queryKeyCreator;
export type QueryKeyCreator<T extends keyof QueryKeyCreatorType> =
  QueryKeyCreatorType[T];
