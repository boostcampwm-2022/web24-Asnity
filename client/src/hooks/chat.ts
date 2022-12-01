import type { GetChatsResult } from '@apis/chat';
import type { AxiosError } from 'axios';

import { getChats } from '@apis/chat';
import { useInfiniteQuery } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

export const useChatsInfiniteQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.list(channelId);
  const infiniteQuery = useInfiniteQuery<GetChatsResult, AxiosError>(
    key,
    ({ pageParam = -1 }) => getChats(channelId, pageParam),
    {
      getPreviousPageParam: (firstPage) => {
        console.log('firstPage.prev', firstPage.prev);
        return firstPage.prev;
      },
      staleTime: Infinity,
    },
  );

  return infiniteQuery;
};
