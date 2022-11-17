import Avatar from '@components/Avatar';
import React from 'react';
import { GetUserResponse } from 'shared/lib/getUserResponse';

type User = Pick<GetUserResponse, 'profileUrl' | 'status' | 'nickname'>;
interface UserItemProps {
  user: User;
}

const UserProfile: React.FC<UserItemProps> = ({
  user: { nickname, profileUrl },
}) => {
  return (
    <li className="flex items-center gap-[11px] h-[87px] px-[12px] border-b border-line">
      <Avatar size="small" variant="circle" name={nickname} url={profileUrl} />
      <div className="font-bold text-s16">{nickname}</div>
    </li>
  );
};

export default UserProfile;
