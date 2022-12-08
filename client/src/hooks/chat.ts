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
  id,
  channelId,
  content,
  senderId,
  createdAt,
  written,
}: {
  id: string;
  channelId: string;
  content: string;
  senderId: string;
  createdAt: Date;
  written?: boolean | -1;
}) => void;

type UpdateChatToWittenChat = ({
  id,
  channelId,
}: {
  id: string;
  channelId: string;
}) => void;

type UpdateChatToFailedChat = UpdateChatToWittenChat;
type RemoveChatQueryData = UpdateChatToWittenChat;

export const useSetChatsQuery = () => {
  const queryClient = useQueryClient();

  /**
   * - 쿼리 데이터의 가장 마지막 페이지, 마지막 인덱스에 새로운 채팅 데이터를 추가한다.
   */
  const addChatsQueryData: AddChatsQueryData = ({
    id,
    channelId,
    content,
    senderId,
    createdAt,
    written,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        draft.pages.at(-1)?.chat?.push({
          id,
          content,
          senderId,
          written, // Send Chat 에러 처리를 위한 프로퍼티
          createdAt: createdAt.toISOString(),
          updatedAt: '',
          deletedAt: '',
          type: 'TEXT',
        });
      });
    });
  };

  /**
   * Optimistic Updates한 채팅의 id와 채널 id를 받아서, 해당 채팅의 written 프로퍼티를 true로 변경시킨다,
   */
  const updateChatToWrittenChat: UpdateChatToWittenChat = ({
    id,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) targetChat.written = true;
      });
    });
  };

  /**
   * Optimistic Updates한 채팅의 id와 채널 id를 받아서, 해당 채팅의 written 프로퍼티를 false로 변경시킨다.
   */
  const updateChatToFailedChat: UpdateChatToFailedChat = ({
    id,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) targetChat.written = false; // 보낸 채팅이 DB 저장에 실패했음을 나타낸다.
      });
    });
  };

  /**
   * 타겟 메세지를 쿼리 상태에서 지웁니다.
   */
  const removeChatQueryData: RemoveChatQueryData = ({ id, channelId }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;

        const targetIndex = chatList.findIndex((chat) => chat.id === id);

        if (targetIndex !== -1) {
          chatList.splice(targetIndex, 1); // 채팅 지우기
        }
      });
    });
  };

  return {
    addChatsQueryData,
    updateChatToWrittenChat,
    updateChatToFailedChat,
    removeChatQueryData,
  };
};
