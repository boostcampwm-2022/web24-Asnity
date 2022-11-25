import type { FormEvent } from 'react';

import FollowerUserItem from '@components/FollowerUserItem';
import SearchInput from '@components/SearchInput';
import UserList from '@components/UserList';
import useUsersQuery from '@hooks/useUsersQuery';
import React, { useState } from 'react';

import Button from '@/components/Button';

// TODO: `handleKeyDown` 이벤트 핸들러 네이밍 명확하게 지어야함
const UserSearch = () => {
  const [submittedFilter, setSubmittedFilter] = useState('');
  const usersQuery = useUsersQuery(submittedFilter, {
    enabled: !!submittedFilter,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filter =
      (new FormData(e.currentTarget).get('user-search') as string) ?? '';

    if (filter.length === 0) return;

    setSubmittedFilter(filter);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-8">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <SearchInput
            name="user-search"
            placeholder="검색하기"
            className="flex-1"
          />
          <Button color="dark" size="sm">
            검색
          </Button>
        </form>
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
