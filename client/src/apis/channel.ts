import type { SuccessResponse } from '@@types/apis/response';
import type { User } from '@apis/user';

import { tokenAxios } from '@utils/axios';

type UserUID = User['_id'];

export interface JoinedChannel {
  _id: string;
  managerId: UserUID;
  name: string;
  isPrivate: boolean;
  profileUrl: string;
  description: string;
  lastRead: boolean;
  type: string; // TODO: DM or Channel -> DM 구현할 때 타입 구체화
}

export interface Channel extends JoinedChannel {
  communityId: string;
  users: Array<UserUID>;
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
