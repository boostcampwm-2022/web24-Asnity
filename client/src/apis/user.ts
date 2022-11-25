import type { SuccessResponse } from '@@types/apis/response';

import { API_URL } from '@constants/url';
import axios from 'axios';

export type UserStatus = 'online' | 'offline' | 'afk';

export interface User {
  _id: string;
  id: string;
  nickname: string;
  status: UserStatus;
  profileUrl: string;
  description: string;
}

export type MyInfoResult = User;

type GetMyInfo = () => Promise<MyInfoResult>;

export const getMyInfo: GetMyInfo = () => {
  return axios
    .get(`${API_URL}/api/user/auth/me`)
    .then((response) => response.data.result);
};

export interface GetFollowingsResult {
  followings: User[];
}
export type GetFollowingsResponse = SuccessResponse<GetFollowingsResult>;

export const getFollowings = (): Promise<GetFollowingsResponse> =>
  axios.get(`${API_URL}/api/user/followings`).then((res) => res.data);

export interface UpdateFollowingResult {
  message?: string;
}
export type UpdateFollowingResponse = SuccessResponse<UpdateFollowingResult>;

export const updateFollowing = (
  userId: string,
): Promise<UpdateFollowingResponse> =>
  axios.post(`${API_URL}/api/user/following/${userId}`).then((res) => res.data);

export interface GetFollowersResult {
  followers: User[];
}

export type GetFollowersResponse = SuccessResponse<GetFollowersResult>;

export const getFollowers = (): Promise<GetFollowersResponse> =>
  axios.get(`${API_URL}/api/user/followers`).then((res) => res.data);
export interface GetUsersParams {
  search: string;
}
export interface GetUsersResult {
  users: User[];
}

export type GetUsersResponse = SuccessResponse<GetUsersResult>;

export const GetUsers = (params: GetUsersParams): Promise<GetUsersResponse> =>
  axios.get(`${API_URL}/api/users`, { params }).then((res) => res.data);
