import type { Chat } from '@apis/chat';
import type { FC } from 'react';

import AlertBox from '@components/AlertBox';
import { useSetChatsQueryData } from '@hooks/chat';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface Props {
  communityId: string;
  channelId: string;
  chat: Chat;
}

const ChatRemoveBox: FC<Props> = ({ communityId, channelId, chat }) => {
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);
  const socket = useSocketStore((state) => state.sockets[communityId]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const { removeChatQueryData } = useSetChatsQueryData();

  const handleSubmitAlert = () => {
    if (!socket.isConnected()) {
      toast.error('채팅 서버와의 연결이 원활하지 않습니다.');
      return;
    }

    setIsRequestPending(true);
    socket.removeChat(
      { chatId: chat.id, channelId },
      ({ written, chatInfo }) => {
        if (written) {
          removeChatQueryData({ ...chatInfo, channelId });
          closeCommonModal();
          return;
        }
        toast.error('채팅 삭제에 실패했습니다!');
        setIsRequestPending(false);
      },
    );

    // setTimeout(() => {
    //   const error = false;
    //
    //   if (!error) {
    //     removeChatQueryData({
    //       id: chat.id,
    //       deletedAt: new Date().toISOString(),
    //       channelId,
    //     });
    //     closeCommonModal();
    //     return;
    //   }
    //   toast.error('채팅 삭제에 실패했습니다!');
    //   setIsRequestPending(false);
    // }, 1000);
  };

  return (
    <AlertBox
      description="채팅을 삭제합니다."
      onSubmit={handleSubmitAlert}
      onCancel={closeCommonModal}
      disabled={isRequestPending}
    />
  );
};

export default ChatRemoveBox;
