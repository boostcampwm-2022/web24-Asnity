import type { UseQueryOptions } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import getFollowings from '../apis/getFollowings';

type QueryOptions = Omit<
  UseQueryOptions<{ s: string }, unknown, { s: string }, string[]>,
  'queryKey' | 'queryFn' | 'initialData'
>;

// TODO: useQuery<응답 데이터> 제네릭 활용해서 타이핑이 가능합니다.
// TODO: 옵션 타이핑 방법은 더 찾아봐야 알겠지만 위와 같이 가능한 것 같기도.
const useFollowingsQuery = (search: string, options?: QueryOptions) => {
  const query = useQuery(
    ['followings', search],
    () => getFollowings(search),
    options,
  );

  return query;
};

export default useFollowingsQuery;
