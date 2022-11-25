import type { GetDirectMessagesResult } from '@apis/dm';
import type { AxiosError } from 'axios';

import { getDirectMessages } from '@apis/dm';
import { useQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useDirectMessagesQuery = () => {
  const query = useQuery<GetDirectMessagesResult, AxiosError>(
    queryKeyCreator.directMessage.list(),
    getDirectMessages,
  );

  return query;
};

export default useDirectMessagesQuery;
