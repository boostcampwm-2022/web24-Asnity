import type { User } from '@apis/user';
import type { FC } from 'react';

import FollowingUserItem from '@components/FollowingUserItem';
import UserList from '@components/UserList';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  users: User[];
}

/**
 *
 * @returns 팔로잉 목록을 렌더링하는 컴포넌트
 */
const FollowingUserSearchResult: FC<Props> = ({ users }) => {
  if (!users.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        검색 결과가 없습니다.
      </div>
    );
  }
  return (
    <Scrollbars>
      <UserList>
        {users.map((user) => (
          <FollowingUserItem key={user._id} user={user} />
        ))}
      </UserList>
    </Scrollbars>
  );
};

export default FollowingUserSearchResult;
