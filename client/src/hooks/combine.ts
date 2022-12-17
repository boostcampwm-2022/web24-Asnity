import REGEX from '@constants/regex';
import { useUpdateLastReadMutation } from '@hooks/channel';
import { useInvalidateCommunitiesQuery } from '@hooks/community';
import useInterval from '@hooks/useInterval';

/**
 * 10초마다 커뮤니티 목록을 불러옵니다. 채널에 입장해있다면 해당 채널의 lastRead를 업데이트한 뒤에 불러옵니다.
 */
export const useUpdateLastReadAndInvalidateCommunitiesInterval = (
  intervalTime = 1000 * 10,
) => {
  const updateLastReadMutation = useUpdateLastReadMutation();
  const invalidateCommunitiesQuery = useInvalidateCommunitiesQuery();

  useInterval(() => {
    const groups = window.location.pathname.match(REGEX.CHANNEL)?.groups as {
      communityId?: string;
      roomId?: string;
    };

    /**
     * useParams를 쓰지 않는 이유는, roomId나 communityId를 디펜던시 배열에 넣지 않으므로 이전의 값으로 고정이 되기 때문이다. (불변성)
     * 디펜던시 배열에 roomId나 communityId를 넣지 않는 이유는 채널을 이동할 때마다 interval이 초기화되기 때문이다.
     */
    if (groups?.communityId && groups?.roomId) {
      updateLastReadMutation
        .mutateAsync({
          communityId: groups.communityId,
          channelId: groups.roomId,
        })
        .catch((error) => console.error(error)) // 여기의 에러는 로깅만. 커뮤니티 목록을 불러오는게 끊기면 안됩니다.
        .finally(() => {
          invalidateCommunitiesQuery();
        });
      return;
    }

    invalidateCommunitiesQuery();
  }, intervalTime);
};
