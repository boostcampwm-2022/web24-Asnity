import type { User } from '@apis/user';
import type { AxiosError } from 'axios';

import { getFollowings } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

const useFollowingsQuery = (
  filter?: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.followings.all();
  const query = useQuery<User[], AxiosError>(key, getFollowings, {
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

export default useFollowingsQuery;

export const useInvalidateFollowingsQuery = () => {
  const key = queryKeyCreator.followings.all();

  const queryClient = useQueryClient();
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return invalidate;
};
