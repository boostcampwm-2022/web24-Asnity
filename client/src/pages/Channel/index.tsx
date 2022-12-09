import type { User } from '@apis/user';

import ChatForm from '@components/ChatForm';
import ChatList from '@components/ChatList';
import Spinner from '@components/Spinner';
import { faker } from '@faker-js/faker';
import { useMyInfoQueryData } from '@hooks/auth';
import { useChannelWithUsersMapQuery } from '@hooks/channel';
import { useChatsInfiniteQuery, useSetChatsQueryData } from '@hooks/chat';
import useIntersectionObservable from '@hooks/useIntersectionObservable';
import ChannelUserStatus from '@layouts/ChannelUserStatus';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { isScrollTouchedBottom } from '@utils/scrollValues';
import React, { useRef, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

import { sendChatPayload, SOCKET_EVENTS } from '@/socketEvents';

const Channel = () => {
  const scrollbarContainerRef = useRef<Scrollbars>(null);

  const params = useParams();
  const communityId = params.communityId as string;
  const roomId = params.roomId as string;

  const myInfo = useMyInfoQueryData() as User; // 인증되지 않으면 이 페이지에 접근이 불가능하기 때문에 무조건 myInfo가 있음.
  const channelWithUsersMap = useChannelWithUsersMapQuery(roomId);

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

  const {
    addChatsQueryData,
    updateChatQueryDataToFailedChat,
    updateChatQueryDataToWrittenChat,
  } = useSetChatsQueryData();
  const setChatScrollbar = useRootStore((state) => state.setChatScrollbar);
  const chatScrollbar = useRootStore((state) => state.chatScrollbar);

  // 메세지 보내기:
  const socket = useSocketStore((state) => state.sockets[communityId]);

  const handleSubmitChat = (content: string) => {
    const id = faker.datatype.uuid();
    const createdAt = new Date();
    const newChat = { id, content, createdAt, senderId: myInfo._id };

    addChatsQueryData({
      id,
      channelId: roomId,
      content,
      createdAt,
      senderId: myInfo._id,
      written: -1, // Optimistic Updates중임을 나타냄.
    });

    // https://socket.io/docs/v3/emitting-events/#acknowledgements
    socket.emit(
      SOCKET_EVENTS.SEND_CHAT,
      sendChatPayload({
        ...newChat,
        channelId: roomId,
      }),
      ({ written }: { written: boolean }) => {
        if (written) {
          updateChatQueryDataToWrittenChat({ id, channelId: roomId });
          return;
        }

        updateChatQueryDataToFailedChat({ id, channelId: roomId });
      },
    );

    if (isScrollTouchedBottom(scrollbarContainerRef.current, 50)) {
      setTimeout(() => {
        scrollbarContainerRef.current?.scrollToBottom();
      });
    }
  };

  useEffect(() => {
    if (scrollbarContainerRef.current !== chatScrollbar) {
      // 비교 연산 없으면 채널간 이동에서 딜레이가 매우 많이 생긴다.
      setChatScrollbar(scrollbarContainerRef.current);
    }

    if (!chatsInfiniteQuery.isLoading) {
      scrollbarContainerRef.current?.scrollToBottom();
    }
  }, [roomId, chatsInfiniteQuery.isLoading]);

  const isLoading =
    channelWithUsersMap.isLoading || chatsInfiniteQuery.isLoading;

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
        <div className="flex flex-col relative flex-1 min-w-[768px] max-w-[960px] h-full py-4">
          <div className="flex justify-center items-center font-ipSans text-s14">
            {chatsInfiniteQuery.isFetchingPreviousPage &&
              '지난 메시지 불러오는 중'}
          </div>
          <Scrollbars
            className="max-h-[90%] grow shrink"
            ref={scrollbarContainerRef}
          >
            <div ref={intersectionObservable} />
            <ul className="flex flex-col gap-3 [&>*:hover]:bg-background">
              {chatsInfiniteQuery.data && channelWithUsersMap.data && (
                <ChatList
                  pages={chatsInfiniteQuery.data.pages}
                  users={channelWithUsersMap.data.users}
                />
              )}
            </ul>
          </Scrollbars>
          <ChatForm
            className="max-h-[20%] w-[95%] grow shrink-0 mx-auto mt-6"
            handleSubmitChat={handleSubmitChat}
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
