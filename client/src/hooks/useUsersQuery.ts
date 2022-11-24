import type { GetUsersResponse, GetUsersResult } from '@apis/user';

import { GetUsers } from '@apis/user';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

type UsersQueryData = {
  statusCode: number;
} & GetUsersResult;

const useUserSearchQuery = (
  filter: string,
  options?: { suspense?: boolean; enabled?: boolean },
) => {
  const key = queryKeyCreator.userSearch(filter);
  const query = useQuery<GetUsersResponse, unknown, UsersQueryData>(
    key,
    () => GetUsers(filter),
    {
      ...options,
      select: (data) => {
        const { statusCode, result } = data;
        const { users } = result;

        return { statusCode, ...result, users };
      },
    },
  );

  return query;
};

export default useUserSearchQuery;
