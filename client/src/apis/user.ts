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

type Followings = User[];
export interface GetFollowingsResult {
  followings: Followings;
}
export type GetFollowingsResponse = SuccessResponse<GetFollowingsResult>;
export type GetFollowings = () => Promise<Followings>;

export const getFollowings: GetFollowings = () => {
  const endPoint = `/api/user/followings`;

  return tokenAxios
    .get<GetFollowingsResponse>(endPoint)
    .then((res) => res.data.result.followings);
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

type Followers = User[];
export type GetFollowersResult = {
  followers: Followers;
};
export type GetFollowersResponse = SuccessResponse<GetFollowersResult>;
export type GetFollowers = () => Promise<Followers>;

export const getFollowers: GetFollowers = () => {
  const endPoint = `/api/user/followers`;

  return tokenAxios
    .get<GetFollowersResponse>(endPoint)
    .then((res) => res.data.result.followers);
};

export interface GetUsersParams {
  search: string;
}
export type GetUsersResult = User[];
export type GetUsersResponse = SuccessResponse<GetUsersResult>;
export type GetUsers = (params: GetUsersParams) => Promise<GetUsersResult>;

/**
 * 여러 유저 검색에 사용됨
 */
export const getUsers: GetUsers = (params) => {
  const endPoint = `/api/users`;

  return tokenAxios
    .get<GetUsersResponse>(endPoint, { params })
    .then((response) => response.data.result);
};

export interface GetCommunityUsersResult {
  users: User[];
}
export type GetCommunityUsersResponse =
  SuccessResponse<GetCommunityUsersResult>;
export type GetCommunityUsers = (communityId: string) => Promise<User[]>;

export const getCommunityUsers: GetCommunityUsers = (communityId) => {
  const endPoint = `/api/communities/${communityId}/users`;

  return tokenAxios
    .get<GetCommunityUsersResponse>(endPoint)
    .then((response) => response.data.result.users);
};
