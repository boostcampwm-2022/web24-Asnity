import type { GetMyInfoResult } from '@apis/user';
import type { AxiosError } from 'axios';

import { getMyInfo } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

export const useMyInfoQuery = () => {
  const key = queryKeyCreator.me();
  const query = useQuery<GetMyInfoResult, AxiosError>(key, getMyInfo);

  return query;
};

export default useMyInfoQuery;

export const useMyInfo = () => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.me();
  const me = queryClient.getQueryData<GetMyInfoResult>(key);

  return me;
};
