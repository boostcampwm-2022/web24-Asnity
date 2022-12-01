import type { User } from '@apis/user';
import type { AxiosError } from 'axios';

import { getChannelUsers, getCommunityUsers } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

export const useUserQuery = (
  userId: string,
  options?: {
    enabled?: boolean;
  },
) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.user.detail(userId);

  const query = useQuery(key, () => getUser(userId), options);
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return { userQuery: query, invalidateUserQuery: invalidate };
};

export const useCommunityUsersQuery = (communityId: string) => {
  const key = queryKeyCreator.user.communityUsers(communityId);

  const query = useQuery<User[], AxiosError>(key, () =>
    getCommunityUsers(communityId),
  );

  return { communityUsersQuery: query };
};

export const useInvalidateCommunityUsersQuery = (communityId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.user.communityUsers(communityId);

  const invalidateCommunityUsersQuery = () =>
    queryClient.invalidateQueries(key);

  return { invalidateCommunityUsersQuery };
};

// TODO: `options` any 타입 바꾸기
export const useChannelUsersQuery = (
  channelId: string,
  options?: {
    select?: (
      users: GetChannelUsersResult['users'],
    ) => GetChannelUsersResult['users'];
    enabled?: boolean;
  },
) => {
  const key = queryKeyCreator.user.channelUsers(channelId);

  const query = useQuery<GetChannelUsersResult['users'], AxiosError>(
    key,
    () => getChannelUsers(channelId),
    options,
  );

  return query;
};
