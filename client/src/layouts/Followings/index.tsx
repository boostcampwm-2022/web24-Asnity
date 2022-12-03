import FollowingUserItem from '@components/FollowingUserItem';
import SearchInput from '@components/SearchInput';
import UserList from '@components/UserList';
import useDebouncedValue from '@hooks/useDebouncedValue';
import useFollowingsQuery from '@hooks/useFollowingsQuery';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

/**
 *
 * @returns 검색 인풋과 팔로잉 목록을 렌더링하는 컴포넌트.
 * 기본적으로는 사용자의 모든 팔로잉 목록을 렌더링하나,
 * 사용자가 검색 인풋에 검색어를 입력하면 해당 값으로 필터링된 팔로잉 목록을 렌더링한다.
 */

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
        ) : followingsQuery.data?.length ? (
          <UserList>
            {followingsQuery.data.map((user) => (
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
