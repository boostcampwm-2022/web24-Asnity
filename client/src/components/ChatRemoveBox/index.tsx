import type { FC } from 'react';

import AlertBox from '@components/AlertBox';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

export interface Props {}

const ChatRemoveBox: FC<Props> = () => {
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const handleSubmitAlert = () => {};

  return (
    <AlertBox
      description="채팅을 삭제합니다."
      onSubmit={handleSubmitAlert}
      onCancel={closeCommonModal}
    />
  );
};

export default ChatRemoveBox;
