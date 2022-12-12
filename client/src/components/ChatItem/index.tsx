import type { Chat } from '@apis/chat';
import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC, MouseEventHandler } from 'react';

import Avatar from '@components/Avatar';
import ChatContent from '@components/ChatContent';
import ChatForm from '@components/ChatForm';
import ChatActions from '@components/ChatItem/ChatActions';
import ChatRemoveBox from '@components/ChatRemoveBox';
import { LOGO_IMG_URL } from '@constants/url';
import defaultSocketErrorHandler from '@errors/defaultSocketErrorHandler';
import { useMyInfoQueryData } from '@hooks/auth';
import { useSetChatsQueryData } from '@hooks/chat';
import useHover from '@hooks/useHover';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import { dateStringToKRLocaleDateString } from '@utils/date';
import cn from 'classnames';
import React, { memo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  nickname: '삭제된 사용자',
  profileUrl: '',
  status: 'OFFLINE',
  description: 'fakeUser',
  createdAt: new Date().toISOString(),
};

const systemBot: User = {
  _id: 'system',
  id: 'system@from.asnity',
  nickname: '시스템',
  profileUrl: LOGO_IMG_URL,
  status: 'ONLINE',
  description: '시스템 봇',
  createdAt: new Date().toDateString(),
};

interface Props extends ComponentPropsWithoutRef<'li'> {
  className?: string;
  chat: Chat;
  user?: User;
  communityManagerId?: string;
  channelManagerId?: string;
}

const ChatItem: FC<Props> = ({
  className = '',
  chat,
  user = chat.type === 'SYSTEM' ? systemBot : deletedUser,
  channelManagerId,
  communityManagerId,
}) => {
  const openCommonModal = useRootStore((state) => state.openCommonModal);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const myInfo = useMyInfoQueryData() as User;
  const { roomId, communityId } = useParams() as {
    roomId: string;
    communityId: string;
  };

  const socket = useSocketStore((state) => state.sockets[communityId]);
  const { content, written, id, senderId, deletedAt } = chat;
  const { isDeleted, isFailedToSendChat, isSystemChat } = getChatStatus(chat);
  const { isHover, ...hoverHandlers } = useHover(false);
  const isPending = written === -1;
  const isFailed = written === false;
  const isMine = myInfo._id === senderId;
  const isManager =
    communityManagerId === myInfo._id || channelManagerId === myInfo._id;

  const opacityClassnames = cn({
    'opacity-40': isPending || isFailedToSendChat,
  });

  const {
    discardChatQueryData,
    editChatQueryData,
    updateEditChatToWrittenChat,
    updateEditChatToFailedChat,
  } = useSetChatsQueryData();

  const handleClickDiscardButton = () => {
    discardChatQueryData({ channelId: roomId, id });
  };

  const handleClickCopyButton: MouseEventHandler<HTMLButtonElement> = () => {
    if (!chatContentRef.current) return;

    const $$p = chatContentRef.current?.querySelectorAll('p');
    const chunks = [] as string[];

    if ($$p) {
      $$p.forEach(($p) => {
        chunks.push($p.textContent || '');
      });
    }

    window.navigator.clipboard.writeText(chunks.join('\n')).then(() => {
      toast.success('클립보드에 복사 완료!', { position: 'bottom-right' });
    });
  };

  const handleClickEditButton = () => setIsEditing(true);

  const handleCancelChatEditForm = () => setIsEditing(false);

  const handleClickRemoveButton: MouseEventHandler<HTMLButtonElement> = () => {
    openCommonModal({
      content: (
        <ChatRemoveBox
          communityId={communityId}
          channelId={roomId}
          chat={chat}
        />
      ),
      contentWrapperStyle: {
        top: '50%',
        left: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
      overlayBackground: 'black',
    });
  };

  const handleSubmitChatEditForm = (editedContent: string) => {
    if (!socket.isConnected()) {
      defaultSocketErrorHandler();
      return;
    }

    const editedChatInfo = {
      id, // realId
      content: editedContent,
      channelId: roomId,
    };

    editChatQueryData(editedChatInfo);
    setIsEditing(false);

    socket.editChat(
      { ...editedChatInfo, chatId: id },
      ({ written: _written, chatInfo }) => {
        if (_written) {
          updateEditChatToWrittenChat({
            updatedChat: chatInfo,
            channelId: roomId,
          });
          return;
        }

        updateEditChatToFailedChat({ id, channelId: roomId, content });
        toast.error('채팅 수정에 실패했습니다.');
      },
    );

    // 테스트용
    // const fail = true;

    // setTimeout(() => {
    //   if (fail) {
    //     updateEditChatToFailedChat({ id, channelId: roomId, content });
    //     toast.error('채팅 수정에 실패했습니다.');
    //   } else {
    //     updateEditChatToWrittenChat({
    //       updatedChat: { ...chat, ...editedChatInfo },
    //       channelId: roomId,
    //     });
    //   }
    // }, 1000);
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
            <div className={`${opacityClassnames}`} ref={chatContentRef}>
              {isDeleted ? (
                <p className="opacity-50">삭제된 채팅입니다.</p>
              ) : isEditing ? (
                <ChatForm
                  editMode
                  initialValue={content}
                  handleSubmitChat={handleSubmitChatEditForm}
                  handleCancelEdit={handleCancelChatEditForm}
                />
              ) : (
                <ChatContent content={content} />
              )}
            </div>
          </div>
          <div className="absolute -top-3 right-3">
            {!isSystemChat &&
              !deletedAt &&
              !isFailed &&
              !isEditing &&
              !isPending &&
              isHover && (
                <ChatActions.Container className="bg-background">
                  <ChatActions.Copy onClick={handleClickCopyButton} />
                  {isMine && (
                    <ChatActions.Edit onClick={handleClickEditButton} />
                  )}
                  {(isMine || isManager) && (
                    <ChatActions.Remove onClick={handleClickRemoveButton} />
                  )}
                </ChatActions.Container>
              )}
          </div>
        </div>
      </li>
    )
  );
};

export default memo(ChatItem);
