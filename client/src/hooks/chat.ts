import type { GetChatsResult } from '@apis/chat';
import type { InfiniteData } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getChats } from '@apis/chat';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import produce from 'immer';

import queryKeyCreator from '@/queryKeyCreator';

export const useChatsInfiniteQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.list(channelId);
  const infiniteQuery = useInfiniteQuery<GetChatsResult, AxiosError>(
    key,
    ({ pageParam = -1 }) => getChats(channelId, pageParam),
    {
      getPreviousPageParam: (firstPage) => firstPage.prev,
      staleTime: 1000 * 60 * 10,
    },
  );

  return infiniteQuery;
};

type AddChatsQueryData = ({
  content,
  senderId,
}: {
  content: string;
  senderId: string;
}) => void;

/**
 * - addChatsQueryData: 쿼리의 가장 마지막 페이지에 새로운 채팅 데이터를 추가
 */
export const useSetChatsQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.list(channelId);
  const queryClient = useQueryClient();

  const addChatsQueryData: AddChatsQueryData = ({ content, senderId }) => {
    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        draft.pages.at(-1)?.chat?.push({
          id: crypto.randomUUID(),
          type: 'TEXT',
          createdAt: new Date().toISOString(),
          updatedAt: '',
          deletedAt: '',
          content,
          senderId,
        });
      });
    });
  };

  return { addChatsQueryData };
};
