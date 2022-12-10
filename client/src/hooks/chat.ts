import type { Chat, GetChatsResult } from '@apis/chat';
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
}: Omit<Chat, 'type' | 'updatedAt' | 'createdAt'> & {
  channelId: string;
  createdAt: Date;
}) => void;

type UpdateChatToWrittenChat = ({
  id,
  channelId,
  realChatId,
}: Pick<Chat, 'id'> & { channelId: string; realChatId: number }) => void;

type UpdateChatQueryDataToFailedChat = ({
  id,
  channelId,
}: Pick<Chat, 'id'> & { channelId: string }) => void;

type UpdateChatToFailedChat = UpdateChatToWrittenChat;
type RemoveChatQueryData = ({
  id,
  channelId,
}: Pick<Chat, 'id'> & { channelId: string }) => void;

type EditChatQueryData = ({
  id,
  channelId,
}: Pick<Chat, 'id' | 'content'> & { channelId: string }) => void;

export const useSetChatsQueryData = () => {
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
  const updateChatToWrittenChat: UpdateChatToWrittenChat = ({
    id,
    realChatId,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.written = true;
          targetChat.id = realChatId;
        }
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

  const editChatQueryData: EditChatQueryData = ({ id, channelId, content }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      let targetPageIndex = -1;

      data.pages.some((page, pageIndex) => {
        if (!page.chat || !page.chat.length) return false;
        const pageFirstChatId = page.chat[0].id;
        const pageLastChatId = page.chat.at(-1)?.id as number;
        // chat.at()가 undefined 일 수 있는 이유는, 최대 길이 이상의 값이나 음수를 넣을 수 있기 때문인데,
        // at(-1)은 마지막 인덱스를 가리키고, 이 블럭은 chat.length > 0인 조건문 안이라서 undefined 일 수가 없으므로 assertion 사용.

        if (pageFirstChatId <= id && id <= pageLastChatId) {
          targetPageIndex = pageIndex;
          return true;
        }

        return false;
      });

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;

        chatList.map((chat) => {
          if (chat.id === id) {
            chat.content = content;
            chat.written = -1;
          }
          return chat;
        });
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
    editChatQueryData,
  };
};
