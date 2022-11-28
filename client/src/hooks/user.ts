import { getUser } from '@apis/user';
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
