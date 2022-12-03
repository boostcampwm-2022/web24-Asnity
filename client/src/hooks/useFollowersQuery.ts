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
