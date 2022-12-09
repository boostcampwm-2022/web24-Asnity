import type {
  Channel,
  CreateChannelRequest,
  CreateChannelResult,
  GetChannelResult,
  InviteChannelResult,
  JoinedChannel,
  LeaveChannelResult,
} from '@apis/channel';
import type { CommunitySummaries } from '@apis/community';
import type { UsersMap } from '@hooks/user';
import type {
  MutationOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  inviteChannel,
  leaveChannel,
  createChannel,
  getChannel,
} from '@apis/channel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

export const useChannelQuery = (channelId: string) => {
  const key = queryKeyCreator.channel.detail(channelId);

  const query = useQuery<GetChannelResult, AxiosError>(key, () =>
    getChannel(channelId),
  );

  return query;
};

export const useInvalidateChannelQuery = (channelId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.channel.detail(channelId);

  const invalidte = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return invalidte;
};

export const usePrefetchChannelQuery = (channelId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.channel.detail(channelId);

  const prefetchQuery = () =>
    queryClient.prefetchQuery<GetChannelResult, AxiosError>(key, () =>
      getChannel(channelId),
    );

  return prefetchQuery;
};

export type ChannelWithUsersMap = Omit<Channel, 'users'> & {
  users: UsersMap;
};

/**
 *
 * @param channelId 채널 id
 * @returns `users`가 `UsersMap`인 `Channel` 객체
 */
export const useChannelWithUsersMapQuery = (channelId: string) => {
  const key = queryKeyCreator.channel.detail(channelId);
  const query = useQuery<GetChannelResult, AxiosError, ChannelWithUsersMap>(
    key,
    () => getChannel(channelId),
    {
      select: (channel) => ({
        ...channel,
        users: channel.users.reduce(
          (acc, cur) => ({ ...acc, [cur._id]: cur }),
          {},
        ),
      }),
    },
  );

  return query;
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
 * - addChannelQueryData: 커뮤니티 아이디와 추가할 채널을 인자로 전달.
 */
export const useSetChannelQueryData = () => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.community.list();

  const addChannelQueryData = (communityId: string, channel: JoinedChannel) => {
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

  const removeChannelQueryData = (communityId: string, channelId: string) => {
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

  return { addChannelQueryData, removeChannelQueryData };
};

export const useLeaveChannelMutation = (
  options?: MutationOptions<LeaveChannelResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.channel.leaveChannel();
  const mutation = useMutation(key, leaveChannel, { ...options });

  return mutation;
};

export const useInviteChannelMutation = (
  options?: MutationOptions<InviteChannelResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.channel.inviteChannel();
  const mutation = useMutation(key, inviteChannel, { ...options });

  return mutation;
};
