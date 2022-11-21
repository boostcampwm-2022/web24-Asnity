import React, { useState, Suspense } from 'react';

import FollowingList from './components/list';
import SearchInput from './components/searchInput';
import useDebouncedValue from './hooks/useDebouncedValue';
import useFollowingsQuery from './hooks/useFollowingsQuery';

const FollowingTab = () => {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, 500);
  const { data } = useFollowingsQuery(debouncedFilter, { suspense: true });

  return (
    <>
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="검색하기"
        />
      </div>
      <Suspense fallback={<div>loading...</div>}>
        {data.result.followings.length ? (
          <FollowingList users={data.result.followings} />
        ) : (
          '일치하는 사용자가 없습니다.'
        )}
      </Suspense>
    </>
  );
};

export default FollowingTab;
