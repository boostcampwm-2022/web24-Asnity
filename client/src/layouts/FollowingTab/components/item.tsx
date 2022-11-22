import UserProfile from '@components/UserProfile';
import {
  EllipsisHorizontalIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/20/solid';
import useFollowingMutation from '@hooks/useFollowingMutation';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'shared/lib/user';

interface FollowingProps {
  user: User;
}

const FollowingItem: React.FC<FollowingProps> = ({ user }) => {
  const navigate = useNavigate();
  const updateFollowing = useFollowingMutation(user._id);

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
          <span className="sr-only">다이렉트 메시지</span>
          <ChatBubbleLeftIcon className="w-6 h-6 fill-indigo" />
        </button>
        <button className="p-2 rounded-full border border-line">
          <span className="sr-only">더보기</span>
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
