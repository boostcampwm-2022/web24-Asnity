import useDebouncedValue from '@hooks/useDebouncedValue';
import useFollowingsQuery from '@hooks/useFollowingsQuery';
import React, { useState, Suspense, useEffect } from 'react';

import FollowingList from './components/list';
import SearchInput from './components/searchInput';

const FollowingTab = () => {
  const DEBOUNCE_DELAY = 500;
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, DEBOUNCE_DELAY);
  const followingQuery = useFollowingsQuery({
    suspense: true,
    select: (data) => {
      const { result } = data;
      const followings = debouncedFilter
        ? result.followings.filter(({ nickname }) =>
          nickname.toUpperCase().includes(filter.toUpperCase()),
        )
        : result.followings;

      return { ...data, result: { ...result, followings } };
    },
  });

  return (
    <div>
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="검색하기"
        />
      </div>
      <Suspense fallback={<div>loading...</div>}>
        {followingQuery.data?.result.followings ? (
          <FollowingList users={followingQuery.data.result.followings} />
        ) : (
          '일치하는 사용자가 없습니다.'
        )}
      </Suspense>
    </div>
  );
};

export default FollowingTab;
