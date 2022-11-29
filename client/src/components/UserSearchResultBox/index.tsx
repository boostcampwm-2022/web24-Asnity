import type { User } from '@apis/user';
import type { FC } from 'react';

import FollowerUserItem from '@components/FollowerUserItem';
import UserList from '@components/UserList';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

export interface Props {
  users: User[];
}

const UserSearchResult: FC<Props> = ({ users }) => {
  return (
    <Scrollbars>
      {users.length ? (
        <UserList>
          {users.map((user) => (
            <FollowerUserItem key={user._id} user={user} />
          ))}
        </UserList>
      ) : (
        <div className="flex justify-center items-center">
          검색된 사용자가 없습니다
        </div>
      )}
    </Scrollbars>
  );
};

export default UserSearchResult;
