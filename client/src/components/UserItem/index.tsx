import type { User } from '@apis/user';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import UserProfile from '@components/UserProfile';
import React, { memo } from 'react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  user: User;
  right?: ReactNode;
}

const UserItem: React.FC<Props> = ({ user, right }) => {
  return (
    <div className="flex justify-between items-center px-10 min-w-full py-2">
      <UserProfile user={user} />
      {right}
    </div>
  );
};

export default memo(UserItem);
