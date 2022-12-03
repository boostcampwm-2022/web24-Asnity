import type { User } from '@apis/user';
import type { FC } from 'react';

import FollowingUserContextMenu from '@components/FollowingUserContextMenu';
import UserItem from '@components/UserItem';
import {
  EllipsisHorizontalIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/20/solid';
import { useRootStore } from '@stores/rootStore';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  user: User;
}

const FollowingUserItem: FC<Props> = ({ user }) => {
  const openCommonModal = useRootStore((state) => state.openCommonModal);

  const handleMoreButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    openCommonModal({
      content: <FollowingUserContextMenu user={user} />,
      overlayBackground: 'transparent',
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <UserItem
      user={user}
      right={
        <div className="flex gap-4">
          <Link
            to={`/dms/${user._id}`}
            className="p-2 rounded-full border border-line"
          >
            <span className="sr-only">다이렉트 메시지</span>
            <ChatBubbleLeftIcon className="w-6 h-6 fill-indigo" />
          </Link>
          <button
            className="p-2 rounded-full border border-line"
            onClick={handleMoreButtonClick}
          >
            <span className="sr-only">더보기</span>
            <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
          </button>
        </div>
      }
    />
  );
};

export default memo(FollowingUserItem);
