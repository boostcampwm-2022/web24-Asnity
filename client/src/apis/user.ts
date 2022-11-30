import type { SuccessResponse } from '@@types/apis/response';
import type { USER_STATUS } from '@constants/user';

import { tokenAxios } from '@utils/axios';

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export interface User {
  _id: string;
  id: string;
  nickname: string;
  status: UserStatus;
  profileUrl: string;
  description: string;
}

export type UserUID = User['_id'];

export type GetMyInfoResult = User;
export type GetMyInfoResponse = SuccessResponse<GetMyInfoResult>;
export type GetMyInfo = () => Promise<GetMyInfoResult>;

export const getMyInfo: GetMyInfo = () => {
  const endPoint = `/api/user/auth/me`;

  return tokenAxios
    .get<GetMyInfoResponse>(endPoint)
    .then((response) => response.data.result);
};

export type GetFollowingsResult = User[];
export type GetFollowingsResponse = SuccessResponse<GetFollowingsResult>;
export type GetFollowings = () => Promise<GetFollowingsResult>;

export const getFollowings: GetFollowings = () => {
  const endPoint = `/api/user/followings`;

  return tokenAxios
    .get<GetFollowingsResponse>(endPoint)
    .then((res) => res.data.result);
};

export interface UpdateFollowingResult {
  message?: string;
}
export type UpdateFollowingResponse = SuccessResponse<UpdateFollowingResult>;
export type UpdateFollowing = (
  userId: string,
) => Promise<UpdateFollowingResult>;

export const updateFollowing: UpdateFollowing = (userId) => {
  const endPoint = `/api/user/following/${userId}`;

  return tokenAxios
    .post<UpdateFollowingResponse>(endPoint)
    .then((res) => res.data.result);
};

export type GetFollowersResult = User[];
export type GetFollowersResponse = SuccessResponse<GetFollowersResult>;
export type GetFollowers = () => Promise<GetFollowersResult>;

export const getFollowers: GetFollowers = () => {
  const endPoint = `/api/user/followers`;

  return tokenAxios
    .get<GetFollowersResponse>(endPoint)
    .then((res) => res.data.result);
};

export interface GetUsersParams {
  search: string;
}
export type GetUsersResult = User[];
export type GetUsersResponse = SuccessResponse<GetUsersResult>;
export type GetUsers = (params: GetUsersParams) => Promise<GetUsersResult>;

export const getUsers: GetUsers = (params) => {
  const endPoint = `/api/users`;

  return tokenAxios
    .get<GetUsersResponse>(endPoint, { params })
    .then((response) => response.data.result);
};

export type GetUserResult = User;
export type GetUserResponse = SuccessResponse<GetUserResult>;
export type GetUser = (userId: string) => Promise<GetUserResult>;

export const getUser: GetUser = (userId) => {
  const endPoint = `/api/users/${userId}`;

  return tokenAxios
    .get<GetUserResponse>(endPoint)
    .then((response) => response.data.result);
};

export interface GetCommunityUsersResult {
  users: User[];
}
export type GetCommunityUsersResponse =
  SuccessResponse<GetCommunityUsersResult>;
export type GetCommunityUsers = (communityId: string) => Promise<User[]>;

export const getCommunityUsers: GetCommunityUsers = (communityId) => {
  const endPoint = `/api/community/${communityId}/participants`;

  return tokenAxios
    .get<GetCommunityUsersResponse>(endPoint)
    .then((response) => response.data.result.users);
};
