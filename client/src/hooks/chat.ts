import type { Chat, GetChatsResult, GetUnreadChatIdResult } from '@apis/chat';
import type { InfiniteData } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getUnreadChatId, getChats } from '@apis/chat';
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import produce from 'immer';

import queryKeyCreator from '@/queryKeyCreator';

export const useChatsInfiniteQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.list(channelId);
  const infiniteQuery = useInfiniteQuery<GetChatsResult, AxiosError>(
    key,
    ({ pageParam = -1 }) => getChats(channelId, pageParam),
    {
      getPreviousPageParam: (firstPage) => firstPage?.prev,
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
  createdAt: Date | string;
}) => void;

type UpdateChatToWrittenChat = ({
  id,
  channelId,
  realChatId,
}: Pick<Chat, 'id'> & { channelId: string; realChatId: number }) => void;

type UpdateChatToFailedChat = ({
  id,
  channelId,
}: Pick<Chat, 'id'> & { channelId: string }) => void;

type DiscardChatQueryData = ({
  id,
  channelId,
}: Pick<Chat, 'id'> & { channelId: string }) => void;

type RemoveChatQueryData = ({
  id,
  deletedAt,
  channelId,
}: Pick<Chat, 'id' | 'deletedAt'> & { channelId: string }) => void;

type EditChatQueryData = ({
  id,
  channelId,
}: Pick<Chat, 'id' | 'content'> & { channelId: string }) => void;

type UpdateEditChatToWrittenChat = ({
  updatedChat,
  channelId,
}: {
  updatedChat: Chat;
  channelId: string;
}) => void;

type UpdateEditChatToFailedChat = ({
  id,
  content,
  channelId,
}: {
  id: number;
  content: string;
  channelId: string;
}) => void;

type UpdateChatQueryData = ({
  updatedChat,
  channelId,
}: {
  updatedChat: Chat;
  channelId: string;
}) => void;

type SpliceAndPushChatQueryData = ({
  id,
  channelId,
  content,
  senderId,
  createdAt,
  written,
}: Chat & {
  channelId: string;
  realChatId: number;
}) => void;

/**
 * ?????? id??? ?????? ?????? ???????????? ?????????, ?????? ?????? id??? ?????????????????? ???????????? ???????????? ??????
 */
const searchTargetChatPageIndex = (
  id: number,
  data: InfiniteData<GetChatsResult>,
) => {
  let targetPageIndex = -1;

  data.pages.some((page, pageIndex) => {
    if (!page.chat || !page.chat.length) return false;
    const pageFirstChatId = page.chat[0].id;
    const pageLastChatId = page.chat.at(-1)?.id as number;
    // chat.at()??? undefined ??? ??? ?????? ?????????, ?????? ?????? ????????? ????????? ????????? ?????? ??? ?????? ????????????,
    // at(-1)??? ????????? ???????????? ????????????, ??? ????????? chat.length > 0??? ????????? ???????????? undefined ??? ?????? ???????????? assertion ??????.

    if (pageFirstChatId <= id && id <= pageLastChatId) {
      targetPageIndex = pageIndex;
      return true;
    }

    return false;
  });

  return targetPageIndex;
};

export const useSetChatsQueryData = () => {
  const queryClient = useQueryClient();

  /**
   * - ?????? ???????????? ?????? ????????? ?????????, ????????? ???????????? ????????? ?????? ???????????? ????????????.
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
          written, // Send Chat ?????? ????????? ?????? ????????????
          createdAt: new Date(createdAt).toISOString(),
          updatedAt: '',
          deletedAt: '',
          type: 'TEXT',
        });
      });
    });
  };

  /**
   * Optimistic Updates??? ????????? id(fakeId)???, realChatId???, ?????? id??? ?????????,
   * ?????? ????????? written ??????????????? true??? ???????????????, id??? realChatId??? ???????????????.
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
   * Optimistic Updates??? ????????? id??? ?????? id??? ?????????, ?????? ????????? written ??????????????? false??? ???????????????.
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

        if (targetChat) targetChat.written = false; // ?????? ????????? DB ????????? ??????????????? ????????????.
      });
    });
  };

  /**
   * ?????? ???????????? ???????????????. written??? -1???(Pending) ???????????????.
   */
  const editChatQueryData: EditChatQueryData = ({ id, channelId, content }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      const targetPageIndex = searchTargetChatPageIndex(id, data);

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.content = content;
          targetChat.written = -1;
        }
      });
    });
  };

  /**
   * ????????? ???????????? written??? true??? ???????????? updatedAt??? ???????????????.
   */
  const updateEditChatToWrittenChat: UpdateEditChatToWrittenChat = ({
    updatedChat,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;
      const { id, updatedAt } = updatedChat;

      const targetPageIndex = searchTargetChatPageIndex(id, data);

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;
        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.updatedAt = updatedAt || new Date().toISOString();
          targetChat.written = true;
        }
      });
    });
  };

  /**
   * ????????? ????????? ????????????, ?????? ????????? ???????????????.
   */
  const updateEditChatToFailedChat: UpdateEditChatToFailedChat = ({
    id,
    channelId,
    content,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      const targetPageIndex = searchTargetChatPageIndex(id, data);

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.content = content;
          targetChat.written = undefined;
        }
      });
    });
  };

  /**
   * ?????? ????????? ?????? ???????????? ?????? ???????????? ???????????????. (remove??? ????????????. remove??? deleteAt??? ???????????? ?????????)
   */
  const discardChatQueryData: DiscardChatQueryData = ({ id, channelId }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;

        const targetIndex = chatList.findIndex((chat) => chat.id === id);

        if (targetIndex !== -1) {
          chatList.splice(targetIndex, 1); // ?????? ?????????
        }
      });
    });
  };

  /**
   * ?????? ????????? deletedAt??? ??????????????????, content??? ????????????.
   */
  const removeChatQueryData: RemoveChatQueryData = ({
    id,
    deletedAt,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      const targetPageIndex = searchTargetChatPageIndex(id, data);

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.content = '';
          targetChat.deletedAt = deletedAt || new Date().toISOString();
        }
      });
    });
  };

  /**
   * ?????? ???????????? ??????????????????, updatedAt??? ??????????????? ???????????? ???????????????.
   * ?????? on?????? ???????????? ????????? ?????? ???????????? ????????? ??? ???????????????.
   */
  const updateChatQueryData: UpdateChatQueryData = ({
    updatedChat,
    channelId,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      const { id, content, updatedAt } = updatedChat;

      const targetPageIndex = searchTargetChatPageIndex(id, data);

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages[targetPageIndex].chat;

        if (!chatList) return;

        const targetChat = chatList.find((chat) => chat.id === id);

        if (targetChat) {
          targetChat.content = content;
          targetChat.updatedAt = updatedAt;
        }
      });
    });
  };

  /**
   * id(fakeId)??? ???????????? ????????? splice??????, realChatId??? ????????? ????????? ????????? ??? ?????? ????????????.
   */
  const spliceAndPushChatQueryData: SpliceAndPushChatQueryData = ({
    id,
    realChatId,
    channelId,
    content,
    senderId,
    createdAt,
    updatedAt,
    type,
    written,
  }) => {
    const key = queryKeyCreator.chat.list(channelId);

    queryClient.setQueryData<InfiniteData<GetChatsResult>>(key, (data) => {
      if (!data) return undefined;

      return produce(data, (draft: InfiniteData<GetChatsResult>) => {
        const chatList = draft.pages.at(-1)?.chat;

        if (!chatList) return;
        const targetIndex = chatList.findIndex((chat) => chat.id === id);

        chatList.splice(targetIndex, 1);
        chatList.push({
          id: realChatId,
          content,
          senderId,
          written,
          createdAt,
          updatedAt,
          type,
        });
      });
    });
  };

  return {
    addChatsQueryData,
    updateChatToWrittenChat,
    updateChatToFailedChat,
    discardChatQueryData,
    editChatQueryData,
    updateEditChatToWrittenChat,
    updateEditChatToFailedChat,
    updateChatQueryData,
    removeChatQueryData,
    spliceAndPushChatQueryData,
  };
};

/**
 *
 * @param channelId ?????? ?????????
 * @returns ??? ?????? ???????????? ??????(id)??? ????????????.
 */
export const useUnreadChatIdQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const query = useQuery<GetUnreadChatIdResult['unreadChatId'], AxiosError>(
    key,
    () => getUnreadChatId(channelId),
    {
      cacheTime: 0,
    },
  );

  return query;
};

/**
 * ### ????????? ????????? ?????? ?????? ???????????? ??????(`Chat['id']`)??? ????????? ?????? ????????????.
 */
export const useSetUnreadChatIdQueryData = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const queryClient = useQueryClient();

  /**
   * ### ????????? ????????? ?????? ?????? ???????????? ????????? `-1`??? ?????????.
   * => ????????? ??? ?????? ???????????? ????????? ?????????.
   */
  const clearUnreadChatIdQueryData = () => {
    queryClient.setQueryData<GetUnreadChatIdResult['unreadChatId']>(key, -1);
  };

  return { clearUnreadChatIdQueryData };
};

/**
 * ### ????????? ????????? ?????? ?????? ???????????? ??????(`Chat['id']`)??? ???????????? ?????? ????????????.
 */
export const useUnreadChatIdQueryData = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const queryClient = useQueryClient();
  const unreadChatId = queryClient.getQueryData(key);

  return unreadChatId;
};
