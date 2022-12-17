import type { GetChatsResult } from '@apis/chat';
import type { UsersMap } from '@hooks/user';
import type { FC } from 'react';

import ChatItem from '@components/ChatItem';
import {
  useSetUnreadChatIdQueryData,
  useUnreadChatIdQuery,
  useUnreadChatIdQueryData,
} from '@hooks/chat';
import useIntersectionObservable from '@hooks/useIntersectionObservable';
import React, { useEffect, useRef, Fragment } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  pages: GetChatsResult[];
  users: UsersMap;
  communityManagerId?: string;
  channelManagerId?: string;
  unreadChatId: number;
}

const ChatList: FC<Props> = ({
  pages,
  users,
  communityManagerId,
  channelManagerId,
  unreadChatId,
}) => {
  const params = useParams();
  const channelId = params.roomId as string;

  // unreadChatId = -1이면, 안 읽은 메세지가 없다는 의미.
  const { clearUnreadChatIdQueryData } = useSetUnreadChatIdQueryData(channelId);
  const firstUnreadChatObservable = useIntersectionObservable(
    (entry, observer) => {
      observer.unobserve(entry.target);
      clearUnreadChatIdQueryData();
    },
  );

  // 현재 캐시에 저장된 안 읽은 메시지의 id를 가져온다.
  const cachedUnreadChatId = useUnreadChatIdQueryData(channelId) as number;
  // 채널 입장 시의 안 읽은 메시지의 id를 저장한다.
  const firstUnreadChatId = useRef(unreadChatId);

  return (
    <>
      {pages.map(
        (page) =>
          !!page.chat?.length && (
            <Fragment key={page.chat[0].id}>
              {page.chat.map((chat) => (
                <Fragment key={chat.id}>
                  {/* 채널 입장 시의 안 읽은 메시지의 id와 chat.id가 같다면 divider를 띄운다 */}
                  {chat.id === firstUnreadChatId.current && (
                    <div
                      className="flex items-center relative h-0 my-3 border-b-[1px] border-error"
                      ref={
                        /* 캐시에 저장된 안 읽은 메시지의 id가 -1이 되면 divider에 더이상
                        observable ref가 붙지 않도록 한다*/
                        cachedUnreadChatId !== -1
                          ? firstUnreadChatObservable
                          : null
                      }
                    >
                      <span className="flex absolute rounded-xl px-1 right-0 bg-error text-s12 text-offWhite mr-1">
                        NEW
                      </span>
                    </div>
                  )}
                  <ChatItem
                    chat={chat}
                    className="px-5 py-3 tracking-tighter"
                    user={users[chat.senderId]}
                    communityManagerId={communityManagerId}
                    channelManagerId={channelManagerId}
                  />
                </Fragment>
              ))}
            </Fragment>
          ),
      )}
    </>
  );
};

export default ChatList;
