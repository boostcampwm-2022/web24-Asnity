import type { User } from '@apis/user';

import ChatForm from '@components/ChatForm';
import ChatList from '@components/ChatList';
import Spinner from '@components/Spinner';
import defaultSocketErrorHandler from '@errors/defaultSocketErrorHandler';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useMyInfoQueryData } from '@hooks/auth';
import {
  useChannelWithUsersMapQuery,
  useSetChannelQueryData,
  useUpdateLastReadMutation,
} from '@hooks/channel';
import {
  useChatsInfiniteQuery,
  useSetChatsQueryData,
  useSetUnreadChatIdQueryData,
  useUnreadChatIdQuery,
} from '@hooks/chat';
import { useCommunityManagerIdQuery } from '@hooks/community';
import useIntersectionObservable from '@hooks/useIntersectionObservable';
import ChannelUserStatus from '@layouts/ChannelUserStatus';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { isScrollTouchedBottom } from '@utils/scrollValues';
import React, { useRef, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { communityId, roomId } = useParams() as {
    communityId: string;
    roomId: string;
  };

  const myInfo = useMyInfoQueryData() as User; // 인증되지 않으면 이 페이지에 접근이 불가능하기 때문에 무조건 myInfo가 있음.
  const channelWithUsersMap = useChannelWithUsersMapQuery(roomId);
  const channelManagerId = channelWithUsersMap.data?.managerId;
  const { data: communityManagerId } = useCommunityManagerIdQuery(communityId);

  /* ============================== [ 무한 스크롤 ] =================================== */
  const scrollbarContainerRef = useRef<Scrollbars>(null);
  const chatsInfiniteQuery = useChatsInfiniteQuery(roomId);
  const intersectionObservable = useIntersectionObservable(
    (entry, observer) => {
      observer.unobserve(entry.target);
      if (
        !chatsInfiniteQuery.hasPreviousPage ||
        chatsInfiniteQuery.isFetchingPreviousPage
      )
        return;

      chatsInfiniteQuery.fetchPreviousPage().then(() => {
        if (scrollbarContainerRef?.current) {
          /* TODO: 새로 불러와도 스크롤 안 움직인 것처럼 만들기 */
          scrollbarContainerRef.current.scrollTop(10);
        }
      });
    },
  );

  /* ============================== [ 소켓 채팅 전송 ] =================================== */
  const chatScrollbar = useRootStore((state) => state.chatScrollbar);
  const setChatScrollbar = useRootStore((state) => state.setChatScrollbar);

  const socket = useSocketStore((state) => state.sockets[communityId]);
  const { addChatsQueryData, updateChatToFailedChat, updateChatToWrittenChat } =
    useSetChatsQueryData();

  const handleSubmitChat = (content: string) => {
    if (!socket.isConnected()) {
      defaultSocketErrorHandler();
      return;
    }

    const id = Date.now(); // fakeId
    const createdAt = new Date();

    // 사용자가 입력한 채팅 메시지 optimistc update
    addChatsQueryData({
      id,
      channelId: roomId,
      content,
      createdAt,
      senderId: myInfo._id,
      written: -1, // Optimistic Updates중임을 나타냄.
    });

    // 소켓으로 채팅 메시지 전송
    socket.sendChat({ channelId: roomId, content }, ({ written, chatInfo }) => {
      if (written) {
        updateChatToWrittenChat({
          id, // fakeId
          realChatId: chatInfo.id,
          channelId: roomId,
        });
        return;
      }
      updateChatToFailedChat({ id, channelId: roomId });
    });

    // 전역 스크롤바 조작
    if (isScrollTouchedBottom(scrollbarContainerRef.current, 50)) {
      setTimeout(() => {
        scrollbarContainerRef.current?.scrollToBottom();
      });
    }
  };

  /* ===================== [ 채널 페이지 입장시 전역 스크롤바 설정 ] =================================== */
  useEffect(() => {
    if (scrollbarContainerRef.current !== chatScrollbar) {
      // 비교 연산 없으면 채널간 이동에서 딜레이가 매우 많이 생긴다.
      setChatScrollbar(scrollbarContainerRef.current);
    }

    if (!chatsInfiniteQuery.isLoading) {
      scrollbarContainerRef.current?.scrollToBottom();
    }
  }, [roomId, chatsInfiniteQuery.isLoading]);

  /* ===================== [ 채널 마지막 방문 시간과 안 읽은 메시지 있음 여부 ] =================================== */
  const { updateExistUnreadChatInChannelQueryData } = useSetChannelQueryData();
  const updateLastReadMutation = useUpdateLastReadMutation({
    onSuccess: () => {
      updateExistUnreadChatInChannelQueryData(communityId, roomId, false);
    },
  });

  useEffect(() => {
    // 채널 페이지에 들어올 때 마지막 방문 시간을 업데이트하고 안 읽은 메시지를 없음으로 표시
    updateLastReadMutation.mutate({ communityId, channelId: roomId });

    // 채널 페이지에서 나갈 때 마지막 방문 시간을 업데이트하고 안 읽은 메시지를 없음으로 표시
    return () =>
      updateLastReadMutation.mutate({ communityId, channelId: roomId });
  }, [communityId, roomId]);

  /* ======================== [ 안 읽은 메시지 위치 ] ========================== */
  const unreadChatIdQuery = useUnreadChatIdQuery(roomId);
  const { clearUnreadChatIdQueryData } = useSetUnreadChatIdQueryData(roomId);
  const handleMarkAsRead = () => clearUnreadChatIdQueryData();

  /* ============================== [ 컴포넌트 렌더링 ] =================================== */
  const isLoading =
    channelWithUsersMap.isLoading ||
    chatsInfiniteQuery.isLoading ||
    unreadChatIdQuery.isLoading;

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="sr-only">로딩중</span>
        <Spinner />
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[56px] w-full border-b border-line shrink-0 basis-[90px]">
        <div className="block w-[400px] overflow-ellipsis overflow-hidden whitespace-nowrap text-indigo font-bold text-[24px]">
          {channelWithUsersMap.data && `#${channelWithUsersMap.data.name}`}
        </div>
      </header>
      <div className="flex h-full">
        <div className="flex flex-col relative flex-1 min-w-[768px] max-w-[960px] h-full pb-4">
          {unreadChatIdQuery.data && unreadChatIdQuery.data !== -1 && (
            <div className="flex justify-between items-center w-full h-8 bg-indigo font-medium text-offWhite rounded-b-md text-s14 px-3">
              <div>위에 읽지 않은 메시지가 있어요</div>
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={handleMarkAsRead}
              >
                <div>읽음으로 표시하기</div>
                <span className="sr-only">읽음으로 표시하기</span>
                <CheckCircleIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          {chatsInfiniteQuery.isFetchingPreviousPage && (
            <div className="flex justify-center items-center font-ipSans text-s14 py-3">
              지난 메시지 불러오는 중
            </div>
          )}
          <Scrollbars
            className="max-h-[90%] grow shrink"
            ref={scrollbarContainerRef}
          >
            <div ref={intersectionObservable} />
            <ul className="flex flex-col gap-3 [&>*:hover]:bg-background pt-7">
              {chatsInfiniteQuery.data && channelWithUsersMap.data && (
                <ChatList
                  communityManagerId={communityManagerId}
                  channelManagerId={channelManagerId}
                  pages={chatsInfiniteQuery.data.pages}
                  users={channelWithUsersMap.data.users}
                />
              )}
            </ul>
          </Scrollbars>
          <ChatForm
            className="max-h-[20%] w-[95%] grow shrink-0 mx-auto mt-6"
            handleSubmitChat={handleSubmitChat}
            clear
          />
        </div>
        <div className="flex grow w-80 h-full border-l border-line">
          {channelWithUsersMap.data && (
            <ChannelUserStatus
              users={Object.values(channelWithUsersMap.data.users)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
