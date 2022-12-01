import ChannelMetadata from '@components/ChannelMetadata';
import ChatItem from '@components/ChatItem';
import { useChannelQuery } from '@hooks/channel';
import { useChatsInfiniteQuery } from '@hooks/chat';
import useIsIntersecting from '@hooks/useIsIntersecting';
import { useChannelUsersQuery } from '@hooks/user';
import React, { useRef, useEffect, Fragment } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { channelQuery } = useChannelQuery(roomId);
  const channelUsersQuery = useChannelUsersQuery(roomId);

  // TODO: `any` 말고 적절한 타이핑 주기
  const scrollbarContainerRef = useRef<any>(null);
  const fetchPreviousRef = useRef<HTMLDivElement>(null);
  const isFetchPreviousIntersecting =
    useIsIntersecting<HTMLDivElement>(fetchPreviousRef);

  const chatsInfiniteQuery = useChatsInfiniteQuery(roomId);

  useEffect(() => {
    if (
      !isFetchPreviousIntersecting ||
      !chatsInfiniteQuery.hasPreviousPage ||
      chatsInfiniteQuery.isFetchingPreviousPage
    )
      return;
    chatsInfiniteQuery.fetchPreviousPage();
  }, [isFetchPreviousIntersecting]);

  if (
    channelQuery.isLoading ||
    channelUsersQuery.isLoading ||
    chatsInfiniteQuery.isLoading
  )
    return <div>loading</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[56px] w-full border-b border-line shrink-0 basis-[90px]">
        <div className="block w-[400px] overflow-ellipsis overflow-hidden whitespace-nowrap text-indigo font-bold text-[24px]">
          {channelQuery.data && `#${channelQuery.data.name}`}
        </div>
      </header>
      <div className="flex h-full">
        <div className="flex-1 min-w-[720px] max-w-[960px] h-full">
          <div className="flex justify-center items-center font-ipSans text-s14">
            {chatsInfiniteQuery.isFetchingPreviousPage &&
              '지난 메시지 불러오는 중'}
          </div>
          <Scrollbars ref={scrollbarContainerRef}>
            <div ref={fetchPreviousRef} />
            <div>
              <ul className="flex flex-col gap-3 [&>*:hover]:bg-background">
                {chatsInfiniteQuery.data?.pages.map((page) =>
                  page.chats.length ? (
                    <Fragment key={page.chats[0].id}>
                      {page.chats.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          className="px-8"
                          user={channelUsersQuery.data?.find(
                            (user) => user._id === chat.senderId,
                          )}
                        />
                      ))}
                    </Fragment>
                  ) : (
                    <Fragment key={channelQuery.data?._id}>
                      {channelQuery.data && channelUsersQuery.data && (
                        <div className="p-8">
                          <ChannelMetadata
                            channel={channelQuery.data}
                            managerName={
                              channelUsersQuery.data?.find(
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
            </div>
          </Scrollbars>
        </div>
        <div className="flex w-72 h-full border-l border-line">
          온라인, 오프라인
        </div>
      </div>
    </div>
  );
};

export default Channel;
