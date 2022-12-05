import ChannelMetadata from '@components/ChannelMetadata';
import ChatForm from '@components/ChatForm';
import ChatItem from '@components/ChatItem';
import Spinner from '@components/Spinner';
import { useChannelQuery } from '@hooks/channel';
import { useChatsInfiniteQuery } from '@hooks/chat';
import useIntersectionObservable from '@hooks/useIntersectionObservable';
import { useChannelUsersMapQuery } from '@hooks/user';
import ChannelUserStatus from '@layouts/ChannelUserStatus';
import React, { useRef, Fragment, useLayoutEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const scrollbarContainerRef = useRef<Scrollbars>(null);

  const params = useParams();
  const roomId = params.roomId as string;
  const { channelQuery } = useChannelQuery(roomId);

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

  const { channelUsersMapQuery } = useChannelUsersMapQuery(roomId);

  useLayoutEffect(() => {
    if (!chatsInfiniteQuery.isLoading) {
      scrollbarContainerRef.current?.scrollToBottom();
    }
  }, [chatsInfiniteQuery.isLoading]);

  const isLoading = channelQuery.isLoading || chatsInfiniteQuery.isLoading;

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
          {channelQuery.data && `#${channelQuery.data.name}`}
        </div>
      </header>
      <div className="flex h-full">
        <div className="flex flex-col relative flex-1 min-w-[960px] max-w-[1080px] h-full py-4">
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
              {chatsInfiniteQuery.data &&
                channelQuery.data &&
                chatsInfiniteQuery.data.pages.map((page) =>
                  page.chat?.length ? (
                    <Fragment key={page.chat[0].id}>
                      {page.chat.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          className="px-5 py-3 tracking-tighter"
                          user={channelQuery.data.users.find(
                            (user) => user._id === chat.senderId,
                          )}
                        />
                      ))}
                    </Fragment>
                  ) : (
                    <Fragment key={channelQuery.data._id}>
                      {channelQuery.data && channelQuery.data.users && (
                        <div className="p-8">
                          <ChannelMetadata
                            channel={channelQuery.data}
                            managerName={
                              channelQuery.data.users.find(
                                (user) =>
                                  user._id === channelQuery.data.managerId,
                              )?.nickname
                            }
                          />
                        </div>
                      )}
                    </Fragment>
                  ),
                )}
            </ul>
          </Scrollbars>
          <ChatForm
            className="max-h-[20%] w-[95%] grow shrink-0 mx-auto mt-6"
            editMode
          />
        </div>
        <div className="flex grow w-80 h-full border-l border-line">
          {channelQuery.data && (
            <ChannelUserStatus users={channelQuery.data.users} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
