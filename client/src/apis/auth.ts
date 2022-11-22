import { SuccessResponse } from '@@types/apis/response';
import { API_URL } from '@constants/url';
import axios from 'axios';

export interface SignUpRequest {
  id: string;
  nickname: string;
  password: string;
}

export interface SignUpResult {
  message: string;
}

type SignUp = (fields: SignUpRequest) => Promise<SuccessResponse<SignUpResult>>;

export const signUp: SignUp = ({ id, nickname, password }) => {
  const endPoint = `${API_URL}/api/user/auth/signup`;

  return axios
    .post(endPoint, { id, nickname, password })
    .then((response) => response.data);
};
