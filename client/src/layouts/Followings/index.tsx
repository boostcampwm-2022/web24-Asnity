import ErrorMessage from '@components/ErrorMessage';
import FollowingUserSearchResult from '@components/FollowingUserSearchResult';
import SearchInput from '@components/SearchInput';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { useFollowingsQuery } from '@hooks/user';
import React, { useState } from 'react';

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
      <div className="flex justify-center items-center w-full h-full">
        {followingsQuery.isLoading ? (
          <div>로딩중...</div>
        ) : followingsQuery.isError ? (
          <ErrorMessage size="lg">에러가 발생했습니다.</ErrorMessage>
        ) : (
          <FollowingUserSearchResult users={followingsQuery.data} />
        )}
      </div>
    </div>
  );
};

export default Followings;
