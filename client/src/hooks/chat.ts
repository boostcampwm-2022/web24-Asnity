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

/**
 * 채팅 id와 채팅 쿼리 데이터를 넘기면, 해당 채팅 id가 포함되어있는 페이지의 인덱스를 반환
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
    // chat.at()가 undefined 일 수 있는 이유는, 최대 길이 이상의 값이나 음수를 넣을 수 있기 때문인데,
    // at(-1)은 마지막 인덱스를 가리키고, 이 블럭은 chat.length > 0인 조건문 안이라서 undefined 일 수가 없으므로 assertion 사용.

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
          createdAt: new Date(createdAt).toISOString(),
          updatedAt: '',
          deletedAt: '',
          type: 'TEXT',
        });
      });
    });
  };

  /**
   * Optimistic Updates한 채팅의 id(fakeId)와, realChatId와, 채널 id를 받아서,
   * 해당 채팅의 written 프로퍼티를 true로 변경시키고, id를 realChatId로 변경시킨다.
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

  /**
   * 타겟 메세지를 수정합니다. written은 -1로(Pending) 설정합니다.
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
   * 수정한 메세지의 written을 true로 설정하고 updatedAt을 반영합니다.
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
   * 메세지 수정에 실패하여, 원래 상태로 되돌립니다.
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
   * 전송 실패한 타겟 메세지를 채팅 목록에서 제거합니다. (remove와 다릅니다. remove는 deleteAt만 업데이트 하는것)
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
          chatList.splice(targetIndex, 1); // 채팅 지우기
        }
      });
    });
  };

  /**
   * 타깃 채팅의 deletedAt을 업데이트하고, content를 비웁니다.
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
   * 타겟 메세지를 업데이트하며, updatedAt과 업데이트된 메세지를 반영합니다.
   * 소켓 on으로 상대방의 메세지 수정 이벤트를 받았을 때 사용합니다.
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
  };
};

/**
 *
 * @param channelId 채널 아이디
 * @returns 안 읽은 메시지의 위치(id)를 반환한다.
 */
export const useUnreadChatIdQuery = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const query = useQuery<GetUnreadChatIdResult['unreadChatId'], AxiosError>(
    key,
    () => getUnreadChatId(channelId),
  );

  return query;
};

/**
 * ### 캐시에 저장된 읽지 않은 메시지의 위치(`Chat['id']`)를 바꾸기 위해 사용한다.
 */
export const useSetUnreadChatIdQueryData = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const queryClient = useQueryClient();

  /**
   * ### 캐시에 저장된 읽지 않은 메시지의 위치를 `-1`로 만든다.
   * => 채널에 안 읽은 메시지가 없도록 만든다.
   */
  const clearUnreadChatIdQueryData = () => {
    queryClient.setQueryData<GetUnreadChatIdResult['unreadChatId']>(key, -1);
  };

  return { clearUnreadChatIdQueryData };
};

/**
 * ### 캐시에 저장된 읽지 않은 메시지의 위치(`Chat['id']`)를 가져오기 위해 사용한다.
 */
export const useUnreadChatIdQueryData = (channelId: string) => {
  const key = queryKeyCreator.chat.unreadChatId(channelId);
  const queryClient = useQueryClient();
  const unreadChatId = queryClient.getQueryData(key);

  return unreadChatId;
};
