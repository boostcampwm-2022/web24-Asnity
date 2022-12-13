import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, FC } from 'react';

import Avatar from '@components/Avatar';
import React, { memo } from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  user: User;
}

const UserProfile: FC<Props> = ({ user }) => {
  const { nickname, profileUrl, status } = user;

  return (
    <div className="flex items-center gap-[11px] py-2 max-w-[220px]">
      <Avatar
        user={user}
        size="sm"
        variant="circle"
        name={nickname}
        profileUrl={profileUrl}
        badge
        status={status}
      />
      <div className="font-bold text-s14 whitespace-nowrap text-ellipsis overflow-hidden">
        {nickname}
      </div>
    </div>
  );
};

export default memo(UserProfile);
