import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import chatData from '../data/chats';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';
import { colorLog } from '../utils/logging';

const getChannelEndPoint = API_URL + endPoint.getChats(':channelId');
const GetChats = rest.get(getChannelEndPoint, (req, res, ctx) => {
  let cursor = Number(req.url.searchParams.get('prev'));
  const ERROR = false;

  // prevCursor가 undefined이거나 0이면 그대로 undefined를 반환한다.
  // prevCursor가 -1이면 첫 요청이라는 뜻이므로 최대 페이지 개수를 반환한다.
  // 그렇지 않으면 prevCursor를 1 줄여 보낸다.
  let prevCursor;

  if (cursor === 0) {
    prevCursor = undefined;
  } else if (cursor === -1) {
    cursor = chatData.totalPageCount;
    prevCursor = cursor - 1;
  } else {
    prevCursor = cursor - 1;
  }

  const chat = cursor >= 0 ? chatData.getChats(cursor) : [];

  colorLog(`Mock Chats Fetch: ${cursor}페이지를 불러옵니다.`);
  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(
    ...createSuccessContext(ctx, 200, 500, {
      prev: prevCursor,
      chat,
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

const getUnreadChatEndPoint = API_URL + endPoint.getUnreadChatId(':channelId');
const GetUnreadChatId = rest.get(getUnreadChatEndPoint, (rea, res, ctx) => {
  const { chats } = chatData;
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(
    ...createSuccessContext(ctx, 200, 500, {
      unreadChatId: chats[Math.floor(Math.random() * chats.length)].id,
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

export default [GetChats, GetUnreadChatId];
