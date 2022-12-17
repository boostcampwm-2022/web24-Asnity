import type { GetDirectMessagesResult } from '@apis/dm';
import type { AxiosError } from 'axios';

import { getDirectMessages } from '@apis/dm';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

export const useDirectMessagesQuery = () => {
  const key = queryKeyCreator.directMessage.list();

  const query = useQuery<GetDirectMessagesResult, AxiosError>(
    key,
    getDirectMessages,
  );

  return query;
};
