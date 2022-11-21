import React from 'react';
import { User } from 'shared/lib/user';

import FollowingItem from './item';

interface FollowingListProps {
  users: User[];
}

const FollowingList: React.FC<FollowingListProps> = ({ users }) => {
  return (
    <ul className="flex flex-col divide-y divide-line">
      {users.map((user: User) => (
        <FollowingItem key={user._id} user={user} />
      ))}
    </ul>
  );
};

export default FollowingList;
