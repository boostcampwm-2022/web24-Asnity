import type { SuccessResponse } from '@@types/apis/response';
import type { JoinedChannel } from '@apis/channel';
import type { UserUID } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface CommunitySummary {
  _id: string;
  name: string;
  profileUrl: string;
  description: string;
  managerId: string;
  channels: JoinedChannel[];
}

export type CommunitySummaries = CommunitySummary[];

export type GetCommunitiesResult = {
  communities: CommunitySummary[];
};

export type GetCommunities = () => Promise<CommunitySummaries>;

export const getCommunities: GetCommunities = () => {
  const endPoint = `/api/communities`;

  return tokenAxios
    .get<SuccessResponse<GetCommunitiesResult>>(endPoint)
    .then((response) => response.data.result.communities);
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
  users: Array<UserUID>;
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

export interface RemoveCommunityResult {
  message: string;
}

export type RemoveCommunity = (
  communityId: string,
) => Promise<RemoveCommunityResult>;

export const removeCommunity: RemoveCommunity = (communityId) => {
  const endPoint = `/api/communities/${communityId}`;

  return tokenAxios.delete(endPoint).then((response) => response.data.result);
};

export interface LeaveCommunityResult {
  message: string;
}

export type LeaveCommunity = (
  communityId: string,
) => Promise<LeaveCommunityResult>;

export const leaveCommunity: LeaveCommunity = (communityId) => {
  const endPoint = `/api/communities/${communityId}/me`;

  return tokenAxios.delete(endPoint).then((response) => response.data.result);
};

export interface InviteCommunityRequest {
  communityId: string;
  userIds: Array<UserUID>;
}

export interface InviteCommunityResult {
  message: string;
}

export type InviteCommunity = (
  fields: InviteCommunityRequest,
) => Promise<InviteCommunityResult>;

export const inviteCommunity: InviteCommunity = ({ communityId, userIds }) => {
  const endPoint = `/api/communities/${communityId}/users`;

  return tokenAxios
    .post<SuccessResponse<InviteCommunityResult>>(endPoint, { users: userIds })
    .then((response) => response.data.result);
};
