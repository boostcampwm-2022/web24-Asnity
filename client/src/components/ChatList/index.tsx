import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import ChatItem from '@components/ChatItem';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'ul'> {
  chats: Chat[];
  users: User[];
}

const ChatList: FC<Props> = ({ chats, users }) => {
  return (
    <ul>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          className="px-5 py-3 tracking-tighter"
          user={users.find((user) => user._id === chat.senderId)}
        />
      ))}
    </ul>
  );
};

export default ChatList;
