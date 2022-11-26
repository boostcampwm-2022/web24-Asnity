import type { SuccessResponse } from '@@types/apis/response';
import type { User } from '@apis/user';

import { tokenAxios } from '@utils/axios';

export interface CreateCommunityRequest {
  name: string;
  description: string;
  profileUrl?: string;
}

export interface CreateCommunityResult {
  name: string;
  managerId: string;
  description: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  channels: [];
  users: Array<User['id']>;
  _id: string;
  __v: 0;
}

export type CreateCommunity = (
  fields: CreateCommunityRequest,
) => Promise<SuccessResponse<CreateCommunityResult>>;

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
