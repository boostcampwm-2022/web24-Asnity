import type { GetChannelResult } from '@apis/channel';
import type { AxiosError } from 'axios';

import { getChannel } from '@apis/channel';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

export const useChannelQuery = (channelId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.channel.detail(channelId);

  const query = useQuery<GetChannelResult, AxiosError>(key, () =>
    getChannel(channelId),
  );
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return { channelQuery: query, invalidateChannelQuery: invalidate };
};
