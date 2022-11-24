import type { User } from '@apis/user';

import UserItem from '@components/UserItem';
import {
  EllipsisHorizontalIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/20/solid';
import useFollowingMutation from '@hooks/useFollowingMutation';
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: User;
}

const FollowingUserItem: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const followingMutation = useFollowingMutation(user._id);
  const { mutate: updateFollowing } = followingMutation;

  const handleChatButtonClick = () => {
    navigate(`/dms/${user._id}`);
  };

  return (
    <UserItem
      user={user}
      right={
        <div className="flex gap-4">
          <button
            className="p-2 rounded-full border border-line"
            onClick={handleChatButtonClick}
          >
            <span className="sr-only">다이렉트 메시지</span>
            <ChatBubbleLeftIcon className="w-6 h-6 fill-indigo" />
          </button>
          <button
            className="p-2 rounded-full border border-line"
            onClick={() => updateFollowing(user)}
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
