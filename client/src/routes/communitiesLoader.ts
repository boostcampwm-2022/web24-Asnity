import type { CommunitySummaries } from '@apis/community';
import type { QueryClient } from '@tanstack/react-query';

import { getCommunities } from '@apis/community';

import queryKeyCreator from '@/queryKeyCreator';

const communitiesLoader = (_queryClient: QueryClient) => async () => {
  const key = queryKeyCreator.community.list();

  return (
    _queryClient.getQueryData<CommunitySummaries>(key) ??
    // eslint-disable-next-line no-return-await
    (await _queryClient.fetchQuery<CommunitySummaries>({
      queryKey: key,
      queryFn: getCommunities,
    }))
  );
};

export default communitiesLoader;
