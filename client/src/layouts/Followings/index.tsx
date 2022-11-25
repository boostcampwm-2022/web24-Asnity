import FollowingUserItem from '@components/FollowingUserItem';
import SearchInput from '@components/SearchInput';
import UserList from '@components/UserList';
import useDebouncedValue from '@hooks/useDebouncedValue';
import useFollowingsQuery from '@hooks/useFollowingsQuery';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

const Followings = () => {
  const DEBOUNCE_DELAY = 500;
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, DEBOUNCE_DELAY);
  const followingsQuery = useFollowingsQuery(debouncedFilter);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="검색하기"
        />
      </div>
      <Scrollbars>
        {followingsQuery.isLoading ? (
          <div className="flex items-center justify-center">로딩중...</div>
        ) : followingsQuery.data?.followings.length ? (
          <UserList>
            {followingsQuery.data.followings.map((user) => (
              <FollowingUserItem key={user._id} user={user} />
            ))}
          </UserList>
        ) : (
          '일치하는 사용자가 없습니다.'
        )}
      </Scrollbars>
    </div>
  );
};

export default Followings;
