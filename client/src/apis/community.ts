import type { SuccessResponse } from '@@types/apis/response';
import type { User } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface CommunitySummary {
  _id: string;
  name: string;
  profileUrl: string;
  description: string;
  managerId: string;
}

export type GetCommunitiesResult = CommunitySummary[];

export type GetCommunities = () => Promise<GetCommunitiesResult>;

export const getCommunities: GetCommunities = () => {
  const endPoint = `/api/user/communities`;

  return tokenAxios
    .get<SuccessResponse<GetCommunitiesResult>>(endPoint)
    .then((response) => response.data.result);
};

export type GetCommunityResult = CommunitySummary;
export type GetCommunity = (communityId: string) => Promise<GetCommunityResult>;
export type GetCommunityResponse = SuccessResponse<GetCommunityResult>;
export const getCommunity: GetCommunity = (communityId: string) => {
  const endPoint = `/api/communities/${communityId}`;

  return tokenAxios
    .get<GetCommunityResponse>(endPoint)
    .then((response) => response.data.result);
};

export interface CreateCommunityRequest {
  name: string;
  description: string;
  profileUrl?: string;
}

export interface CreateCommunityResult extends CommunitySummary {
  __v: 0;
  createdAt: string;
  updatedAt: string;
  channels: [];
  users: Array<User['id']>;
}

export type CreateCommunity = (
  fields: CreateCommunityRequest,
) => Promise<CreateCommunityResult>;

export const createCommunity: CreateCommunity = ({
  name,
  description,
  profileUrl = '',
}) => {
  const endPoint = `/api/community`;

  return tokenAxios
    .post(endPoint, { name, description, profileUrl })
    .then((response) => response.data.result);
};
