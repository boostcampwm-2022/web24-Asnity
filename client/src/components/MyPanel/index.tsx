import type { User } from '@apis/user';
import type { FC } from 'react';

import UserActionBox from '@components/UserActionBox';
import UserProfile from '@components/UserProfile';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

export interface Props {
  me: User;
}

const MyPanel: FC<Props> = ({ me }) => {
  const openModal = useRootStore((state) => state.openCommonModal);

  const handleClickMyPanel = () => {
    openModal({
      content: <UserActionBox />,
      x: 20,
      y: 20,
    });
  };

  return (
    <div
      className="flex w-full px-4 justify-between hover:bg-line cursor-pointer"
      onClick={handleClickMyPanel}
    >
      <UserProfile user={me} />
      <button>
        <span className="sr-only">환경 설정</span>
        <Cog6ToothIcon className="w-7 h-7 fill-label" />
      </button>
    </div>
  );
};

export default MyPanel;
