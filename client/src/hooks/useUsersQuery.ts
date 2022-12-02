import type { GetUsersResult } from '@apis/user';
import type { AxiosError } from 'axios';

import { getUsers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useUserSearchQuery = (
  filter: string,
  options?: { suspense?: boolean; enabled?: boolean },
) => {
  const key = queryKeyCreator.userSearch(filter);
  const query = useQuery<GetUsersResult['users'], AxiosError>(
    key,
    () => getUsers({ search: filter }),
    {
      ...options,
      refetchOnWindowFocus: false,
    },
  );

  return query;
};

export default useUserSearchQuery;
