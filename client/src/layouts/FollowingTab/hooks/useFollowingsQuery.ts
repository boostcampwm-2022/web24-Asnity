import { useQuery } from '@tanstack/react-query';

import getFollowings from '../apis/getFollowings';

const useFollowingsQuery = (search: string, options?: Record<string, any>) => {
  const query = useQuery(
    ['followings', search],
    () => getFollowings(search),
    options,
  );

  return query;
};

export default useFollowingsQuery;
