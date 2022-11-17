import UserProfile from '@components/UserProfile';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { GetUserResponse } from 'shared/lib/getUserResponse';

const getFollowings = () =>
  axios.get('/api/followings').then((res) => res.data);

const Followings = () => {
  const { isLoading, data } = useQuery(['followings'], getFollowings);

  if (isLoading) return <div>loading</div>;

  return (
    <ul className="flex flex-col gap-[12px]">
      {data.result.followings.map(({ _id, ...rest }: GetUserResponse) => (
        <UserProfile key={_id} user={rest} />
      ))}
    </ul>
  );
};

export default Followings;
