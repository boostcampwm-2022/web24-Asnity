import type { SuccessResponse } from '@@types/apis/response';
import type { UserUID } from '@apis/user';

import { API_URL } from '@constants/url';
import { tokenAxios } from '@utils/axios';

export interface DirectMessage {
  _id: string;
  name: string;
  users: UserUID[];
  profileUrl: string;
  description: string;
  managerId: string;
  isPrivate: boolean;
  type: 'DM';
}

export type GetDirectMessagesResult = DirectMessage[];
export type GetDirectMessagesResponse =
  SuccessResponse<GetDirectMessagesResult>;
export type GetDirectMessages = () => Promise<GetDirectMessagesResult>;

export const getDirectMessages: GetDirectMessages = () => {
  const endPoint = `${API_URL}/api/user/dms`;

  return tokenAxios
    .get<GetDirectMessagesResponse>(endPoint)
    .then((res) => res.data.result);
};
