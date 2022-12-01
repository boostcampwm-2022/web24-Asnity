import type { SuccessResponse } from '@@types/apis/response';

import { publicAxios } from '@utils/axios';

export interface SignUpRequest {
  id: string;
  nickname: string;
  password: string;
}

export interface SignUpResult {
  message: string;
}

export type SignUp = (fields: SignUpRequest) => Promise<SignUpResult>;

export const signUp: SignUp = ({ id, nickname, password }) => {
  const endPoint = `/api/user/auth/signup`;

  return publicAxios
    .post<SuccessResponse<SignUpResult>>(endPoint, { id, nickname, password })
    .then((response) => response.data.result);
};

export interface SignInRequest {
  id: string; // username
  password: string;
}

export interface SignInResult {
  _id: string;
  accessToken: string;
}

export type SignIn = (fields: SignInRequest) => Promise<SignInResult>;

export const signIn: SignIn = ({ id, password }) => {
  const endPoint = `/api/user/auth/signin`;

  return publicAxios
    .post<SuccessResponse<SignInResult>>(
      endPoint,
      { id, password },
      { withCredentials: true },
    )
    .then((response) => response.data.result);
};
// 이후 DM 페이지에서 액세스 토큰으로 다시 유저 정보 요청해야함

export interface ReissueTokenResult {
  accessToken: string;
}

export type ReissueToken = () => Promise<ReissueTokenResult>;

export const reissueToken: ReissueToken = () => {
  const endPoint = `/api/user/auth/refresh`;

  return publicAxios
    .post<SuccessResponse<ReissueTokenResult>>(
      endPoint,
      {},
      { withCredentials: true },
    )
    .then((response) => response.data.result);
};
