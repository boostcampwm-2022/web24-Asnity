import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import React from 'react';
import { GetUserResponse } from 'shared/lib/getUserResponse';

type User = Pick<GetUserResponse, 'profileUrl' | 'status' | 'nickname'>;
interface UserItemProps {
  user: User;
}

const USER_STATUS = {
  OFFLINE: 'offline',
  ONLINE: 'online',
  AFK: 'afk',
};

type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

const statusColor: {
  [key: UserStatus]: 'default' | 'success' | 'error';
} = {
  [USER_STATUS.OFFLINE]: 'default',
  [USER_STATUS.ONLINE]: 'success',
  [USER_STATUS.AFK]: 'error',
};

const UserProfile: React.FC<UserItemProps> = ({
  user: { nickname, profileUrl, status },
}) => {
  return (
    <div className="flex items-center gap-[11px] h-[87px]">
      <Badge color={statusColor[status]}>
        <Avatar
          size="small"
          variant="circle"
          name={nickname}
          url={profileUrl}
        />
      </Badge>
      <div className="font-bold text-s16">{nickname}</div>
    </div>
  );
};

export default UserProfile;
