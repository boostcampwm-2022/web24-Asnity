import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React, { memo, useState } from 'react';

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
  const { content, createdAt, updatedAt, deletedAt, written } = chat;
  const [isHover, setIsHover] = useState(false);

  const isUpdated = updatedAt && updatedAt !== createdAt;
  const isDeleted = !!deletedAt;
  const isFailedToSendChat = written === false;
  const contentClassnames = cn({
    'opacity-40': written === -1 || isFailedToSendChat,
  });

  const failedChatControlButtonsClassnames = `flex items-center px-3 rounded`;
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    chat && (
      <li
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-3">
          <div className="pt-1">
            <Avatar
              variant="rectangle"
              size="sm"
              profileUrl={user.profileUrl}
              name={user.nickname}
            />
          </div>
          <div className="grow">
            <div className="flex gap-2 items-center text-s16 mb-2">
              <span
                className={`font-bold ${
                  isSystem ? 'text-primary' : 'text-indigo'
                } ${contentClassnames}`}
              >
                {user.nickname}
              </span>
              {isFailedToSendChat ? (
                <span className="text-error font-bold">전송 실패</span>
              ) : (
                <span className="text-placeholder">
                  {dateStringToKRLocaleDateString(createdAt, {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              )}
              {isDeleted ? (
                <span className="text-label">(삭제됨)</span>
              ) : (
                isUpdated && <span className="text-label">(수정됨)</span>
              )}
              <div className="flex justify-end grow gap-2 text-s14">
                {isFailedToSendChat && isHover && (
                  <>
                    <button
                      type="button"
                      className={`${failedChatControlButtonsClassnames} bg-secondary hover:bg-secondary-dark text-offWhite`}
                    >
                      재전송
                    </button>
                    <button
                      type="button"
                      className={`${failedChatControlButtonsClassnames} bg-error hover:bg-error-dark text-offWhite`}
                    >
                      지우기
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={`${contentClassnames}`}>
              {isDeleted ? (
                '삭제된 메시지입니다'
              ) : (
                <ChatContent content={content} />
              )}
            </div>
          </div>
        </div>
      </li>
    )
  );
};

export default memo(ChatItem);
