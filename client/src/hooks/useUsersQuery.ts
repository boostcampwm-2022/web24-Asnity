import type { GetUsersResponse, User } from '@apis/user';
import type { AxiosError } from 'axios';

import { GetUsers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useUserSearchQuery = (
  filter: string,
  options?: { suspense?: boolean; enabled?: boolean },
) => {
  const key = queryKeyCreator.userSearch(filter);
  const query = useQuery<GetUsersResponse, AxiosError, User[]>(
    key,
    () => GetUsers({ search: filter }),
    {
      ...options,
      select: (data) => {
        return data.result.users;
      },
      refetchOnWindowFocus: false,
    },
  );

  return query;
};

export default useUserSearchQuery;
