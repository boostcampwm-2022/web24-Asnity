import type { Channel } from '@apis/channel';
import type { User, UserUID } from '@apis/user';
import type { AxiosError } from 'axios';

import { getChannel } from '@apis/channel';
import { getCommunityUsers } from '@apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

export const useCommunityUsersQuery = (communityId: string) => {
  const key = queryKeyCreator.user.communityUsers(communityId);

  const query = useQuery<User[], AxiosError>(key, () =>
    getCommunityUsers(communityId),
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
  const key = queryKeyCreator.user.channelUsers(channelId);
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
