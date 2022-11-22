import {
  getFollowings,
  GetFollowingsResponse,
  GetFollowingsResult,
} from '@apis/user';
import { useQuery } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

type FollowingQueryData = {
  statusCode: number;
} & GetFollowingsResult;

const useFollowingsQuery = (
  filter: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.followings();
  const query = useQuery<
    GetFollowingsResponse,
    unknown,
    FollowingQueryData,
    [string]
  >(key, getFollowings, {
    ...options,
    select: (data) => {
      const { statusCode, result } = data;
      const followings = filter
        ? result.followings.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : result.followings;

      return { statusCode, ...result, followings };
    },
  });

  return query;
};

export default useFollowingsQuery;
