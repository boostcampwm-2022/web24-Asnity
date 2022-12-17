import type { SuccessResponse } from '@@types/apis/response';
import type { User, UserUID } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface JoinedChannel {
  _id: string;
  managerId: UserUID;
  name: string;
  isPrivate: boolean;
  description: string;
  existUnreadChat: boolean; // NOTE: get communities에는 있는데, get channel에는 없는 프로퍼티.
  type: string; // TODO: DM or Channel -> DM 구현할 때 타입 구체화
  createdAt: string;
}

export interface Channel extends JoinedChannel {
  users: User[];
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

export interface LeaveChannelResult {
  message: string;
}
export type LeaveChannelResponse = SuccessResponse<LeaveChannelResult>;
export type LeaveChannel = (channelId: string) => Promise<LeaveChannelResult>;
export const leaveChannel: LeaveChannel = (channelId) => {
  const endPoint = `/api/channels/${channelId}/me`;

  return tokenAxios
    .delete<LeaveChannelResponse>(endPoint)
    .then((response) => response.data.result);
};

export interface InviteChannelRequest {
  channelId: string;
  communityId: string;
  userIds: Array<UserUID>;
}
export interface InviteChannelResult {
  message: string;
}
export type InviteChannelResponse = SuccessResponse<InviteChannelResult>;
export type InviteChannel = (
  fields: InviteChannelRequest,
) => Promise<InviteChannelResult>;

export const inviteChannel: InviteChannel = ({
  channelId,
  communityId,
  userIds,
}) => {
  const endPoint = `/api/channels/${channelId}/users`;

  return tokenAxios
    .post<InviteChannelResponse>(endPoint, {
      community_id: communityId,
      userIds,
    })
    .then((response) => response.data.result);
};

export interface UpdateLastReadRequest {
  channelId: string;
  communityId: string;
}

export interface UpdateLastReadResult {
  message: string;
}
export type UpdateLastReadResponse = SuccessResponse<UpdateLastReadResult>;
export type UpdateLastRead = (
  fields: UpdateLastReadRequest,
) => Promise<UpdateLastReadResult>;

export const updateLastRead: UpdateLastRead = ({ channelId, communityId }) => {
  const endPoint = `/api/channels/${channelId}/lastRead`;

  return tokenAxios
    .patch<UpdateLastReadResponse>(endPoint, {
      community_id: communityId,
    })
    .then((response) => response.data.result);
};
