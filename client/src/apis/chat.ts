import type { SuccessResponse } from '@@types/apis/response';

import { tokenAxios } from '@utils/axios';

export type ChatType = 'TEXT' | 'IMAGE';

export interface Chat {
  id: string;
  type: ChatType;
  content: string;
  senderId: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
}

export type GetChatsResult = {
  chats: Chat[];
  prev?: number;
};

export type GetChatsResponse = SuccessResponse<GetChatsResult>;
export type GetChats = (
  channelId: string,
  prev?: number,
) => Promise<GetChatsResult>;

export const getChats: GetChats = (channelId, prev) => {
  const endPoint = `/api/chat/${channelId}`;

  return tokenAxios
    .get<GetChatsResponse>(endPoint, { params: { prev } })
    .then((response) => response.data.result);
};
