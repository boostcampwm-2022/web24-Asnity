import UserItem from '@components/UserItem';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { User } from 'shared/lib/user';

interface Props {
  user: User;
}

const FollowerUserItem: React.FC<Props> = ({ user }) => {
  return (
    <UserItem
      user={user}
      right={
        <div className="flex gap-4">
          <button className="p-2 rounded-full border border-line">
            <span className="sr-only">더보기</span>
            <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
          </button>
        </div>
      }
    />
  );
};

export default FollowerUserItem;
