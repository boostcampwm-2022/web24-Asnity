import FollowingUserItem from '@components/FollowingUserItem';
import SearchInput from '@components/searchInput';
import UserList from '@components/UserList';
import useDebouncedValue from '@hooks/useDebouncedValue';
import useFollowingsQuery from '@hooks/useFollowingsQuery';
import React, { useState } from 'react';

const Followings = () => {
  const DEBOUNCE_DELAY = 500;
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, DEBOUNCE_DELAY);
  const followingsQuery = useFollowingsQuery(debouncedFilter);

  return (
    <div>
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="검색하기"
        />
      </div>
      {followingsQuery.isLoading ? (
        <div>loading...</div>
      ) : followingsQuery.data?.followings.length ? (
        <UserList>
          {followingsQuery.data.followings.map((user) => (
            <FollowingUserItem key={user._id} user={user} />
          ))}
        </UserList>
      ) : (
        '일치하는 사용자가 없습니다.'
      )}
    </div>
  );
};

export default Followings;
