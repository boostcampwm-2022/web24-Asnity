import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef } from 'react';

import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
import { USER_STATUS } from '@constants/user';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  user: User;
}

const STATUS_COLOR = {
  [USER_STATUS.OFFLINE]: 'default',
  [USER_STATUS.ONLINE]: 'success',
  [USER_STATUS.AFK]: 'error',
} as const;

const UserProfile: React.FC<Props> = ({
  user: { nickname, profileUrl, status },
}) => {
  return (
    <div className="flex items-center gap-[11px] py-2">
      <Badge color={STATUS_COLOR[status]}>
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
