import type { Chat } from '@apis/chat';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import { useUserQuery } from '@hooks/user';
import { dateStringToKRLocaleDateString } from '@utils/date';
import React, { memo } from 'react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  chat: Chat;
  isSystem?: boolean;
}

const ChatItem: FC<Props> = ({ className = '', chat, isSystem = false }) => {
  const { content, senderId, updatedAt, createdAt, deletedAt } = chat;
  const { userQuery } = useUserQuery(senderId);

  if (userQuery.isLoading) return <div></div>;
  return (
    <li className={className}>
      {userQuery.data && (
        <div className="flex gap-3">
          <div className="pt-1">
            <Avatar
              variant="rectangle"
              size="small"
              url={userQuery.data.profileUrl}
              name={userQuery.data.nickname}
            />
          </div>
          <div>
            <div className="flex gap-2 items-center text-s16">
              <span
                className={
                  /* format 방지용 */ `font-bold ${
                    /* format 방지용 */ isSystem
                    ? 'text-primary'
                    : 'text-indigo'
                  }`
                }
              >
                {userQuery.data.nickname}
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
      )}
    </li>
  );
};

export default memo(ChatItem);
