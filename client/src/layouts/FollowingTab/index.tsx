import React, { useState, Suspense } from 'react';

import FollowingList from './components/list';
import SearchInput from './components/searchInput';
import useDebouncedValue from './hooks/useDebouncedValue';
import useFollowingsQuery from './hooks/useFollowingsQuery';

const FollowingTab = () => {
  const DEBOUNCE_DELAY = 500;
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, DEBOUNCE_DELAY);

  // TODO: Suspense는 모든 쿼리 인스턴스에 사용할 것인가요?
  // TODO: Suspense가 사용되는 쿼리와 그렇지 않은 쿼리는 어떤 차이를 두고 사용하시나요?
  const { data } = useFollowingsQuery(debouncedFilter, {
    suspense: true,
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
        {data.result.followings.length ? (
          <FollowingList users={data.result.followings} />
        ) : (
          '일치하는 사용자가 없습니다.'
        )}
      </Suspense>
    </div>
  );
};

export default FollowingTab;
