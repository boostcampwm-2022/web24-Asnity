import type { FC } from 'react';

import UserProfile from '@components/UserProfile';
import { useUserQuery } from '@hooks/user';
import React from 'react';

interface Props {
  userId: string;
}

const DirectMessageUserItem: FC<Props> = ({ userId }) => {
  const { userQuery } = useUserQuery(userId);

  if (userQuery.isLoading) return <div></div>;
  return userQuery.data ? (
    <UserProfile user={userQuery.data} />
  ) : (
    <div>사용자가 존재하지 않습니다</div>
  );
};

export default DirectMessageUserItem;
