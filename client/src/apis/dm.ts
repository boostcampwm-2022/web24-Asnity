import type { User } from '@apis/user';

import { API_URL } from '@constants/url';
import axios from 'axios';

export interface DirectMessage {
  _id: string;
  user: User;
}

export type GetDirectMessagesResult = DirectMessage[];

export type GetDirectMessages = () => Promise<GetDirectMessagesResult>;

export const getDirectMessages: GetDirectMessages = () =>
  axios.get(`${API_URL}/api/user/dms`).then((res) => res.data.result);
