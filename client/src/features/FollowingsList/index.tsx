import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { GetUserResponse } from 'shared/lib/getUserResponse';

import FollowingItem from './components/item';

const getFollowings = () =>
  axios.get('/api/user/followings').then((res) => res.data);

const FollowingsList = () => {
  const { isLoading, data } = useQuery(['followings'], getFollowings);

  if (isLoading) return <div>loading</div>;

  return (
    <ul className="flex flex-col divide-y divide-line">
      {data.result.followings.map((user: GetUserResponse) => (
        <FollowingItem key={user._id} user={user} />
      ))}
    </ul>
  );
};

export default FollowingsList;
