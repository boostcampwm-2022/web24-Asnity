import type { SuccessResponse } from '@@types/apis/response';
import type { User } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface Channel {
  id: string;
  managerId: User['_id'];
  name: string;
  users: Array<User['_id']>;
  profileUrl: string;
  description: string;
  isPrivate: boolean;
}

export type GetChannelsResult = Channel[];
export type GetChannelsResponse = SuccessResponse<GetChannelsResult>;
export type GetChannels = (communityId: string) => Promise<GetChannelsResult>;

export const getChannels: GetChannels = (communityId: string) => {
  const endPoint = `/api/user/community/${communityId}/channels`;

  return tokenAxios
    .get<GetChannelsResponse>(endPoint)
    .then((response) => response.data.result);
};
