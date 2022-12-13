import { getCommunities } from '@apis/community';
import REGEX from '@constants/regex';
import { useUpdateLastReadMutation } from '@hooks/channel';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

/**
 * 10초마다 커뮤니티 목록을 불러옵니다. 채널에 입장해있다면 해당 채널의 lastRead를 업데이트한 뒤에 불러옵니다.
 */
export const useUpdateLastReadAndFetchCommunitiesIntervalEffect = (
  refetchInterval: number = 1000 * 10,
) => {
  const queryClient = useQueryClient();
  const updateLastReadMutation = useUpdateLastReadMutation();
  const key = queryKeyCreator.community.list();

  useEffect(() => {
    const interval = setInterval(() => {
      const groups = window.location.pathname.match(REGEX.CHANNEL)?.groups as {
        communityId?: string;
        roomId?: string;
      };

      if (groups?.communityId && groups?.roomId) {
        updateLastReadMutation
          .mutateAsync({
            communityId: groups.communityId,
            channelId: groups.roomId,
          })
          .catch((error) => console.error(error)) // 여기의 에러는 로깅만. 커뮤니티 목록을 불러오는게 끊기면 안됩니다.
          .finally(() => {
            queryClient.fetchQuery(key, getCommunities);
          });
        return;
      }

      queryClient.fetchQuery(key, getCommunities);
    }, refetchInterval);

    return () => clearInterval(interval);
  }, []);
};
