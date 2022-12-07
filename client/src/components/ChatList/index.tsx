import type { GetChatsResult } from '@apis/chat';
import type { UsersMap } from '@hooks/user';
import type { FC } from 'react';

import ChatItem from '@components/ChatItem';
import React, { Fragment } from 'react';

interface Props {
  pages: GetChatsResult[];
  users: UsersMap;
}

const ChatList: FC<Props> = ({ pages, users }) => {
  return (
    <>
      {pages.map((page) =>
        page.chat?.length ? (
          <Fragment key={page.chat[0].id}>
            {page.chat.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                className="px-5 py-3 tracking-tighter"
                user={users[chat.senderId]}
              />
            ))}
          </Fragment>
        ) : (
          <></>
        ),
      )}
    </>
  );
};

export default ChatList;
