import UserProfile from '@components/UserProfile';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserResponse } from 'shared/lib/getUserResponse';

type User = Pick<
  GetUserResponse,
  '_id' | 'id' | 'nickname' | 'profileUrl' | 'status'
>;

interface FollowingProps {
  user: User;
}

const FollowingItem: React.FC<FollowingProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleChatButtonClick = () => {
    navigate(`/dms/${user._id}`);
  };

  return (
    <li className="flex justify-between items-center  px-[12px] w-full border-b border-line hover:bg-background">
      <UserProfile user={user} />
      <div className="flex gap-4">
        <button
          className="w-[40px] h-[40px] rounded-full border border-line"
          onClick={handleChatButtonClick}
        >
          <ChatBubbleRoundedIcon />
        </button>
        <button className="w-[40px] h-[40px] rounded-full border border-line">
          <MoreVertIcon />
        </button>
      </div>
    </li>
  );
};

export default FollowingItem;
