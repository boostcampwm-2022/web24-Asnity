import type { SuccessResponse } from '@@types/apis/response';
import type { User, UserUID } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface JoinedChannel {
  _id: string;
  managerId: UserUID;
  name: string;
  isPrivate: boolean;
  profileUrl: string;
  description: string;
  lastRead: boolean; // NOTE: get communities에는 있는데, get channel에는 없는 프로퍼티.
  type: string; // TODO: DM or Channel -> DM 구현할 때 타입 구체화
}

export interface Channel extends JoinedChannel {
  communityId: string;
  users: User[];
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

export interface CreateChannelResult extends JoinedChannel {}
export type CreateChannelResponse = SuccessResponse<CreateChannelResult>;
export interface CreateChannelRequest {
  communityId: string;
  name: string;
  isPrivate: boolean;
  description: string;
  profileUrl: string;
}
export type CreateChannel = (
  fields: CreateChannelRequest,
) => Promise<CreateChannelResult>;

export const createChannel: CreateChannel = ({
  communityId,
  name,
  isPrivate,
  description = '',
  profileUrl = '',
}) => {
  const endPoint = `/api/channel`;
  const type = 'Channel';

  return tokenAxios
    .post<CreateChannelResponse>(endPoint, {
      communityId,
      name,
      isPrivate,
      description,
      profileUrl,
      type,
    })
    .then((response) => response.data.result);
};
