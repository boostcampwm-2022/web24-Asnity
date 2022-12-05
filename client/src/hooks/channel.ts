import type {
  CreateChannelRequest,
  CreateChannelResult,
  GetChannelResult,
  JoinedChannel,
  LeaveChannelResult,
} from '@apis/channel';
import type { CommunitySummaries } from '@apis/community';
import type {
  MutationOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { leaveChannel, createChannel, getChannel } from '@apis/channel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useCreateChannelMutation = (
  options?: UseMutationOptions<
    CreateChannelResult,
    unknown,
    CreateChannelRequest
  >,
) => {
  const key = queryKeyCreator.channel.createChannel();

  const mutation = useMutation(key, createChannel, { ...options });

  return mutation;
};

/**
 * ### invalidate queries 하지 않고, 수동으로 queryClient update 할 때 사용합니다.
 * - addChannelToCommunity: 커뮤니티 아이디와 추가할 채널을 인자로 전달.
 */
export const useSetChannelsQuery = () => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.community.all();

  // TODO: 네이밍
  const addChannelToCommunity = (
    communityId: string,
    channel: JoinedChannel,
  ) => {
    queryClient.setQueryData<CommunitySummaries>(key, (communities) => {
      const newCommunities = communities?.map((community) => {
        if (community._id !== communityId) return community;

        return {
          ...community,
          channels: [...community.channels, channel],
        };
      });

      return newCommunities;
    });
  };

  const deleteChannelFromCommunity = (
    communityId: string,
    channelId: string,
  ) => {
    queryClient.setQueryData<CommunitySummaries>(key, (communities) => {
      const newCommunities = communities?.map((community) => {
        if (community._id !== communityId) return community;
        return {
          ...community,
          channels: community.channels.filter(
            (channel) => channel._id !== channelId,
          ),
        };
      });

      return newCommunities;
    });
  };

  return { addChannelToCommunity, deleteChannelFromCommunity };
};

export const useLeaveChannelMutation = (
  options?: MutationOptions<LeaveChannelResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.channel.leaveChannel();
  const mutation = useMutation(key, leaveChannel, { ...options });

  return mutation;
};
