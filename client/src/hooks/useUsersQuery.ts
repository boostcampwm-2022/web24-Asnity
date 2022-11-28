import type { GetUsersResponse, User } from '@apis/user';

import { GetUsers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useUserSearchQuery = (
  filter: string,
  options?: { suspense?: boolean; enabled?: boolean },
) => {
  const key = queryKeyCreator.userSearch(filter);
  const query = useQuery<GetUsersResponse, unknown, User[]>(
    key,
    () => GetUsers({ search: filter }),
    {
      ...options,
      select: (data) => {
        return data.result.users;
      },
    },
  );

  return query;
};

export default useUserSearchQuery;
