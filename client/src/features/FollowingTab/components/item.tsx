import UserProfile from '@components/UserProfile';
import {
  EllipsisHorizontalIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/20/solid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'shared/lib/getUserResponse';

import useUpdateFollowing from '../hooks/useUpdateFollowing';

interface FollowingProps {
  user: User;
}

const FollowingItem: React.FC<FollowingProps> = ({ user }) => {
  const navigate = useNavigate();
  const updateFollowing = useUpdateFollowing(user._id);

  const handleChatButtonClick = () => {
    navigate(`/dms/${user._id}`);
  };

  return (
    <li className="flex justify-between items-center px-10 w-full hover:bg-background">
      <UserProfile user={user} />
      <div className="flex gap-4">
        <button
          className="p-2 rounded-full border border-line"
          onClick={handleChatButtonClick}
        >
          <ChatBubbleLeftIcon className="w-6 h-6 fill-indigo" />
        </button>
        <button className="p-2 rounded-full border border-line">
          <EllipsisHorizontalIcon
            className="w-6 h-6 fill-indigo"
            onClick={() => updateFollowing.mutate(user)}
          />
        </button>
      </div>
    </li>
  );
};

export default FollowingItem;
