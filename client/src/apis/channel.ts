import type { SuccessResponse } from '@@types/apis/response';
import type { User } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface JoinedChannel {
  _id: string;
  managerId: User['_id'];
  name: string;
  type: string; // TODO: DM or Channel -> DM 구현할 때 타입 구체화
  isPrivate: boolean;
  profileUrl: string;
  description: string;
  lastRead: boolean;
}

export interface ChannelSummary {
  id: string;
  managerId: User['_id'];
  name: string;
  users: Array<User['_id']>;
  profileUrl: string;
  description: string;
  isPrivate: boolean;
}

export type GetChannelsResult = ChannelSummary[];
export type GetChannelsResponse = SuccessResponse<GetChannelsResult>;
export type GetChannels = (communityId: string) => Promise<GetChannelsResult>;

export const getChannels: GetChannels = (communityId: string) => {
  const endPoint = `/api/user/community/${communityId}/channels`;

  return tokenAxios
    .get<GetChannelsResponse>(endPoint)
    .then((response) => response.data.result);
};

export interface Channel extends ChannelSummary {
  communityId: string;
  type: 'Channel';
  users: Array<User['id']>;
  chatLists: [];
  createdAt: string;
  updatedAt: string;
}

export type GetChannelResult = Channel;
export type GetChannelResponse = SuccessResponse<GetChannelResult>;
export type GetChannel = (channelId: string) => Promise<GetChannelResult>;

export const getChannel: GetChannel = (channelId: string) => {
  const endPoint = `/api/channels/${channelId}`;

  return tokenAxios
    .get<GetChannelResponse>(endPoint)
    .then((response) => response.data.result);
};
