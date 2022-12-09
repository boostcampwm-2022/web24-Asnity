import type { Channel } from '@apis/channel';
import type {
  User,
  UserUID,
  GetUsersResult,
  ToggleFollowingResult,
} from '@apis/user';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getChannel } from '@apis/channel';
import {
  getCommunityUsers,
  getUsers,
  getFollowers,
  toggleFollowing,
  getFollowings,
} from '@apis/user';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import queryKeyCreator from '@/queryKeyCreator';

export const useUsersQuery = (
  filter: string,
  options?: { suspense?: boolean; enabled?: boolean },
) => {
  const key = queryKeyCreator.user.list(filter);
  const query = useQuery<GetUsersResult['users'], AxiosError>(
    key,
    () => getUsers({ search: filter }),
    {
      ...options,
      refetchOnWindowFocus: false,
    },
  );

  return query;
};

export const useFollowingsQuery = (
  filter?: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.following.list();
  const query = useQuery<User[], AxiosError>(key, getFollowings, {
    ...options,
    select: (data) =>
      filter
        ? data.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : data,
  });

  return query;
};

export type FollowingsMap = Record<User['id'], User>;
export const useFollowingsMapQuery = () => {
  const key = queryKeyCreator.following.list();
  const query = useQuery<User[], AxiosError, FollowingsMap>(
    key,
    getFollowings,
    {
      select: (followings) =>
        followings.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
    },
  );

  return query;
};

export const useInvalidateFollowingsQuery = () => {
  const key = queryKeyCreator.following.all();

  const queryClient = useQueryClient();
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return invalidate;
};

export const useFollowersQuery = (
  filter?: string,
  options?: { suspense: boolean },
) => {
  const key = queryKeyCreator.follower.list();
  const query = useQuery<User[], AxiosError>(key, getFollowers, {
    ...options,
    select: (data) =>
      filter
        ? data.filter(({ nickname }) =>
            nickname.toUpperCase().includes(filter.toUpperCase()),
          )
        : data,
  });

  return query;
};

export type FollowersMap = Record<User['id'], User>;
export const useFollowersMapQuery = () => {
  const key = queryKeyCreator.follower.list();
  const query = useQuery<User[], AxiosError, FollowersMap>(key, getFollowers, {
    select: (followers) =>
      followers.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
  });

  return query;
};

export const useToggleFollowingMutation = (
  options?: UseMutationOptions<ToggleFollowingResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.following.toggleFollowing();
  const mutation = useMutation(key, toggleFollowing, { ...options });

  return mutation;
};

export const useCommunityUsersQuery = (
  communityId: string,
  filter?: string,
  options?: {
    enabled?: boolean;
  },
) => {
  const key = queryKeyCreator.user.communityUsers(communityId);

  const query = useQuery<User[], AxiosError>(
    key,
    () => getCommunityUsers(communityId),
    {
      ...options,
      select: (communityUsers) =>
        filter
          ? communityUsers.filter(({ nickname }) =>
              nickname.toUpperCase().includes(filter.toUpperCase()),
            )
          : communityUsers,
    },
  );

  return { communityUsersQuery: query };
};

export const useInvalidateCommunityUsersQuery = (communityId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.user.communityUsers(communityId);

  const invalidateCommunityUsersQuery = () =>
    queryClient.invalidateQueries(key);

  return { invalidateCommunityUsersQuery };
};

export type UsersMap = Record<UserUID, User>;

export const useChannelUsersMapQuery = (channelId: string) => {
  const key = queryKeyCreator.channel.detail(channelId);
  const query = useQuery<Channel, AxiosError, UsersMap>(
    key,
    () => getChannel(channelId),
    {
      select: (data) => {
        const users = data.users;

        const usersMap = users.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as UsersMap);

        return usersMap;
      },
    },
  );

  return { channelUsersMapQuery: query };
};

export type CommunityUsersMap = Record<UserUID, User>;
export const useCommunityUsersMapQuery = (communityId: string) => {
  const key = queryKeyCreator.user.communityUsers(communityId);

  const query = useQuery<User[], AxiosError, CommunityUsersMap>(
    key,
    () => getCommunityUsers(communityId),
    {
      select: (users) =>
        users.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
    },
  );

  return query;
};
