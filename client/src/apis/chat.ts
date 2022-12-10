import type { SuccessResponse } from '@@types/apis/response';

import endPoint from '@constants/endPoint';
import { tokenAxios } from '@utils/axios';

export type ChatType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface Chat {
  id: number;
  type: ChatType;
  content: string;
  senderId: string;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string;
  written?: boolean | -1;
  // -1: Optimistic Updates 중
  // true: DB 쓰기에 성공
  // false: DB 쓰기에 실패
}

export type GetChatsResult = {
  chat?: Chat[];
  prev?: number;
};

export type GetChatsResponse = SuccessResponse<GetChatsResult>;
export type GetChats = (
  channelId: string,
  prev?: number,
) => Promise<GetChatsResult>;

export const getChats: GetChats = (channelId, prev) => {
  const _endPoint = endPoint.getChats(channelId);

  return tokenAxios
    .get<GetChatsResponse>(_endPoint, { params: { prev } })
    .then((response) => response.data.result);
};
