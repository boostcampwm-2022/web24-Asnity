import UserProfile from '@components/UserProfile';
import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { User } from 'shared/lib/user';

interface Props extends ComponentPropsWithoutRef<'li'> {
  user: User;
  right?: ReactNode;
}

const UserItem: React.FC<Props> = ({ user, right }) => {
  return (
    <li className="flex justify-between items-center px-10 min-w-full hover:bg-background">
      <UserProfile user={user} />
      {right}
    </li>
  );
};

export default UserItem;
