import type { GetChannelsResult } from '@apis/channel';
import type { AxiosError } from 'axios';

import { getChannels } from '@apis/channel';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

export const useChannelsQuery = (communityId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.channel.list(communityId);

  const query = useQuery<GetChannelsResult, AxiosError>(key, () =>
    getChannels(communityId),
  );
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return { channelsQuery: query, invalidateChannelsQuery: invalidate };
};
