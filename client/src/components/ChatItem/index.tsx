import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
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
  const { content, createdAt, updatedAt, deletedAt } = chat;

  const isUpdated = updatedAt && updatedAt !== createdAt;
  const isDeleted = !!deletedAt;

  return (
    chat && (
      <li className={className}>
        <div className="flex gap-3">
          <div className="pt-1">
            <Avatar
              variant="rectangle"
              size="sm"
              profileUrl={user.profileUrl}
              name={user.nickname}
            />
          </div>
          <div>
            <div className="flex gap-2 items-center text-s16">
              <span
                className={`font-bold ${
                  isSystem ? 'text-primary' : 'text-indigo'
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
              {isDeleted ? (
                <span className="text-label">(삭제됨)</span>
              ) : (
                isUpdated && <span className="text-label">(수정됨)</span>
              )}
            </div>
            {isDeleted ? (
              <div>삭제된 메시지입니다</div>
            ) : (
              <ChatContent content={content} />
            )}
          </div>
        </div>
      </li>
    )
  );
};

export default memo(ChatItem);
