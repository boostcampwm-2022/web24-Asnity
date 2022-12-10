import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
import { useSetChatsQueryData } from '@hooks/chat';
import useHover from '@hooks/useHover';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React, { memo } from 'react';
import { useParams } from 'react-router-dom';

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
  const params = useParams();
  const roomId = params.roomId as string;
  const { content, createdAt, updatedAt, deletedAt, written, id } = chat;
  const { isHover, ...hoverHandlers } = useHover(false);
  const { removeChatQueryData } = useSetChatsQueryData();

  const isUpdated = updatedAt && updatedAt !== createdAt;
  const isDeleted = !!deletedAt;
  const isFailedToSendChat = written === false;
  const contentClassnames = cn({
    'opacity-40': written === -1 || isFailedToSendChat,
  });
  const failedChatControlButtonsClassnames = `flex items-center px-3 rounded`;

  const handleClickDiscardButton = () => {
    removeChatQueryData({ channelId: roomId, id });
  };

  return (
    chat && (
      <li className={className} {...hoverHandlers}>
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
                  <button
                    type="button"
                    className={`${failedChatControlButtonsClassnames} bg-error hover:bg-error-dark text-offWhite`}
                    onClick={handleClickDiscardButton}
                  >
                    지우기
                  </button>
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
