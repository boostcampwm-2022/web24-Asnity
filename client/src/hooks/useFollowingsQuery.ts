import { getFollowings, GetFollowingsResponse } from '@apis/user';
import { useQuery } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

const useFollowingsQuery = (options?: {
  suspense: boolean;
  select: (data: GetFollowingsResponse) => any;
}) => {
  const key = queryKeyCreator.followings();
  const query = useQuery(key, getFollowings, {
    ...options,
  });

  return query;
};

export default useFollowingsQuery;
