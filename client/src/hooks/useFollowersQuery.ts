import type { GetFollowersResponse, GetFollowersResult } from '@apis/user';

import { getFollowers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

type FollowersQueryData = {
  statusCode: number;
} & GetFollowersResult;

const useFollowersQuery = (filter: string, options?: { suspense: boolean }) => {
  const key = queryKeyCreator.followers();
  const query = useQuery<
    GetFollowersResponse,
    unknown,
    FollowersQueryData,
    [string]
  >(key, getFollowers, {
    ...options,
    select: (data) => {
      const { statusCode, result } = data;
      const followers = filter
        ? result.followers.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : result.followers;

      return { statusCode, ...result, followers };
    },
  });

  return query;
};

export default useFollowersQuery;
