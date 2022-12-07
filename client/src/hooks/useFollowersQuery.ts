import type { User } from '@apis/user';
import type { AxiosError } from 'axios';

import { getFollowers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useFollowersQuery = (
  filter?: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.followers();
  const query = useQuery<User[], AxiosError>(key, getFollowers, {
    ...options,
    select: (data) =>
      filter
        ? data.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : data,
  });

  return query;
};

export default useFollowersQuery;

export type FollowersMap = Record<User['id'], User>;
export const useFollowersMapQuery = () => {
  const key = queryKeyCreator.followers();
  const query = useQuery<User[], AxiosError, FollowersMap>(key, getFollowers, {
    select: (followers) =>
      followers.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
  });

  return query;
};
