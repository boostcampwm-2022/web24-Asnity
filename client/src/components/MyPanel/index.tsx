import type { User } from '@apis/user';
import type { FC, MouseEventHandler } from 'react';

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

  const handleClickMyPanel: MouseEventHandler<HTMLDivElement> = (e) => {
    const { x, height } = e.currentTarget.getBoundingClientRect();

    openModal({
      content: <UserActionBox user={me} />,
      overlayBackground: 'transparent',
      contentWrapperStyle: {
        borderRadius: 16,
        left: x - 10,
        bottom: height + 10,
      },
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
