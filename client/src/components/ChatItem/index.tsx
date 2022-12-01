import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import { dateStringToKRLocaleDateString } from '@utils/date';
import React, { memo } from 'react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  chat: Chat;
  user?: User;
  isSystem?: boolean;
}

const ChatItem: FC<Props> = ({
  className = '',
  chat,
  user = {
    profileUrl: undefined,
    nickname: '(알수없음)',
  },
  isSystem = false,
}) => {
  const { content, updatedAt, createdAt, deletedAt } = chat;

  return (
    <li className={className}>
      <div className="flex gap-3">
        <div className="pt-1">
          <Avatar
            variant="rectangle"
            size="small"
            url={user.profileUrl}
            name={user.nickname}
          />
        </div>
        <div>
          <div className="flex gap-2 items-center text-s16">
            <span
              className={`font-bold ${isSystem ? 'text-primary' : 'text-indigo'
                }`}
            >
              {user.nickname}
            </span>
            <span className="text-placeholder">
              {dateStringToKRLocaleDateString(createdAt, {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
            {deletedAt.length ? (
              <span className="text-label">(삭제됨)</span>
            ) : updatedAt.length ? (
              <span className="text-label">(수정됨)</span>
            ) : (
              ''
            )}
          </div>
          <div>{deletedAt.length ? '삭제된 메시지입니다' : content}</div>
        </div>
      </div>
    </li>
  );
};

export default memo(ChatItem);
