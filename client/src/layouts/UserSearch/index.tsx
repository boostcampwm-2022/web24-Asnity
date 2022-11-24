import type { KeyboardEvent } from 'react';

import FollowerUserItem from '@components/FollowerUserItem';
import SearchInput from '@components/searchInput';
import UserList from '@components/UserList';
import useUsersQuery from '@hooks/useUsersQuery';
import React, { useState } from 'react';

// TODO: `handleKeyDown` 이벤트 핸들러 네이밍 명확하게 지어야함
const UserSearch = () => {
  const [filter, setFilter] = useState('');
  const [제출된필터, set제출된필터] = useState('');
  const usersQuery = useUsersQuery(제출된필터, { enabled: !!제출된필터 });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || filter.length === 0) return;
    set제출된필터(filter);
  };

  return (
    <div>
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색하기"
        />
      </div>
      {usersQuery.data?.users.length ? (
        <UserList>
          {usersQuery.data.users.map((user) => (
            <FollowerUserItem key={user._id} user={user} />
          ))}
        </UserList>
      ) : (
        <div>검색된 사용자가 없습니다</div>
      )}
    </div>
  );
};

export default UserSearch;
