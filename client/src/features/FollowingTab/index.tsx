import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { GetUserResponse } from 'shared/lib/getUserResponse';

import FollowingItem from './components/item';
import SearchInput from './components/searchInput';

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);
  return debouncedValue;
};

const getFollowings = (query: string) =>
  axios.get(`/api/users/followings?query=${query}`).then((res) => res.data);

const FollowingTab = () => {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebouncedValue(filter, 500);
  const { isLoading, data } = useQuery(['followings', debouncedFilter], () =>
    getFollowings(debouncedFilter),
  );

  return (
    <>
      <div className="w-full p-8">
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="검색하기"
        />
      </div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {data.result.followings.length
            ? data.result.followings.map((user: GetUserResponse) => (
              <FollowingItem key={user._id} user={user} />
            ))
            : '일치하는 사용자가 없습니다.'}
        </ul>
      )}
    </>
  );
};

export default FollowingTab;
