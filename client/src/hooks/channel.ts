import type { GetChannelResult, GetChannelsResult } from '@apis/channel';
import type { AxiosError } from 'axios';

import { getChannel, getChannels } from '@apis/channel';
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
