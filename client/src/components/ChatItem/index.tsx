import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
import ChatActions from '@components/ChatItem/ChatActions';
import { useSetChatsQueryData } from '@hooks/chat';
import useHover from '@hooks/useHover';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React, { memo } from 'react';
import { useParams } from 'react-router-dom';

const getChatStatus = ({
  updatedAt,
  createdAt,
  deletedAt,
  written,
  type,
}: Chat) => {
  const isUpdated = updatedAt && updatedAt !== createdAt;
  const isDeleted = !!deletedAt;
  const isFailedToSendChat = written === false;
  const isSystemChat = type === 'SYSTEM';

  return { isUpdated, isDeleted, isFailedToSendChat, isSystemChat };
};

interface ChatItemHeadProps {
  chat: Chat;
  user: User;
  isHover: boolean;
  opacityClassnames: string;
  handleClickDiscardButton: () => void;
}

const ChatItemHead: FC<ChatItemHeadProps> = ({
  chat,
  user,
  isHover,
  opacityClassnames,
  handleClickDiscardButton,
}) => {
  const { createdAt } = chat;
  const { isUpdated, isDeleted, isFailedToSendChat, isSystemChat } =
    getChatStatus(chat);
  const failedChatControlButtonsClassnames = `flex items-center px-3 rounded`;

  return (
    <div className="flex gap-2 items-center text-s16 mb-2">
      <span
        className={`font-bold ${
          isSystemChat ? 'text-primary' : 'text-indigo'
        } ${opacityClassnames}`}
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
  );
};

const deletedUser: User = {
  _id: 'Deleted User',
  id: 'deletedUser@from.asnity',
  nickname: 'DeletedUser',
  profileUrl: '',
  status: 'OFFLINE',
  description: 'fakeUser',
  createdAt: new Date().toISOString(),
};

interface Props extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  chat: Chat;
  user?: User;
}

const ChatItem: FC<Props> = ({ className = '', chat, user = deletedUser }) => {
  const params = useParams();
  const roomId = params.roomId as string;
  const { content, written, id } = chat;
  const { isDeleted, isFailedToSendChat } = getChatStatus(chat);
  const { isHover, ...hoverHandlers } = useHover(false);
  const { removeChatQueryData } = useSetChatsQueryData();

  const opacityClassnames = cn({
    'opacity-40': written === -1 || isFailedToSendChat,
  });

  const handleClickDiscardButton = () => {
    removeChatQueryData({ channelId: roomId, id });
  };

  return (
    chat && (
      <li className={`relative ${className}`} {...hoverHandlers}>
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
            <ChatItemHead
              chat={chat}
              isHover={isHover}
              handleClickDiscardButton={handleClickDiscardButton}
              opacityClassnames={opacityClassnames}
              user={user}
            />
            <div className={`${opacityClassnames}`}>
              {isDeleted ? (
                <p className="opacity-50">삭제된 채팅입니다.</p>
              ) : (
                <ChatContent content={content} />
              )}
            </div>
          </div>
          <div className="absolute -top-3 right-3">
            {isHover && (
              <ChatActions.Container className="bg-background">
                <ChatActions.Copy />
                <ChatActions.Edit />
                <ChatActions.Remove />
              </ChatActions.Container>
            )}
          </div>
        </div>
      </li>
    )
  );
};

export default memo(ChatItem);
