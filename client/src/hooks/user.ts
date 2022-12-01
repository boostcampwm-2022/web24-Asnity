import type { User } from '@apis/user';
import type { AxiosError } from 'axios';

import { getCommunityUsers } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

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
