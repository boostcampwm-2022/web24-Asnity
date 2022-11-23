import type { MyInfoResult } from '@apis/user';

import { getMyInfo } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

export const useMyInfoQuery = () => {
  const key = queryKeyCreator.me();
  const query = useQuery(key, getMyInfo);

  return query;
};

export default useMyInfoQuery;

export const useMyInfo = () => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.me();
  const me = queryClient.getQueryData<MyInfoResult>(key);

  return me;
};
