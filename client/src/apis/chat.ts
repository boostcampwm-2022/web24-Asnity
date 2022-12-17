import type { SuccessResponse } from '@@types/apis/response';

import endPoint from '@constants/endPoint';
import { tokenAxios } from '@utils/axios';

export type ChatType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface Chat {
  id: number; // TODO: chatId로 바꿔야 할 수도.
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

export type GetUnreadChatIdResult = {
  unreadChatId: number;
};

export type GetUnreadChatIdResponse = SuccessResponse<GetUnreadChatIdResult>;
export type GetUnreadChatId = (
  channelId: string,
) => Promise<GetUnreadChatIdResult['unreadChatId']>;

export const getUnreadChatId: GetUnreadChatId = (channelId) => {
  const _endPoint = endPoint.getUnreadChatId(channelId);

  return tokenAxios
    .get<GetUnreadChatIdResponse>(_endPoint)
    .then((response) => response.data.result.unreadChatId);
};
