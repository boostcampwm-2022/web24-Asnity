import type { SuccessResponse } from '@@types/apis/response';
import type { User } from 'shared/lib/user';

import { API_URL } from '@constants/url';
import axios from 'axios';

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
