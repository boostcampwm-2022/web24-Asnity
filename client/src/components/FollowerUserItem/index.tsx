import type { User } from '@apis/user';
import type { FC } from 'react';

import UserItem from '@components/UserItem';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import useFollowingMutation from '@hooks/useFollowingMutation';
import React, { memo } from 'react';

interface Props {
  user: User;
}

// TODO: 팔로잉한 사용자는 팔로우할 수 없도록
// TODO: 팔로워, 팔로잉 정보 띄워주도록
// TODO: 사용자 아이디 띄워주도록
const FollowerUserItem: FC<Props> = ({ user }) => {
  const followingMutation = useFollowingMutation(user._id);

  return (
    <UserItem
      user={user}
      right={
        <div className="flex gap-4">
          <button
            className="p-2 rounded-full border border-line"
            onClick={() => followingMutation.mutate(user)}
            disabled={followingMutation.isLoading}
          >
            <span className="sr-only">더보기</span>
            <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
          </button>
        </div>
      }
    />
  );
};

export default memo(FollowerUserItem);
