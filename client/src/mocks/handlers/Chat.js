import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { createMockChat } from '../data/chats';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const BASE_URL = `${API_URL}/api`;

const MAX_PREVIOUS_PAGE = 2;
const GetChats = rest.get(`${BASE_URL}/chat/:channelId`, (req, res, ctx) => {
  // const { channelId } = req.params;
  const prev = Number(req.url.searchParams.get('prev'));
  // const nextCursor = req.url.searchParams.get('next');

  const ERROR = false;

  // prevCursor가 undefined이거나 0이면 그대로 undefined를 반환한다.
  // prevCursor가 -1이면 첫 요청이라는 뜻이므로 최대 페이지 개수를 반환한다.
  // 그렇지 않으면 prevCursor를 1 줄여 보낸다.
  const newPrevCursor =
    isNaN(prev) || prev === 0
      ? undefined
      : prev === -1
      ? MAX_PREVIOUS_PAGE
      : prev - 1;

  console.log(newPrevCursor);
  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(
    ...createSuccessContext(ctx, 200, 1000, {
      prev: newPrevCursor,
      chats: Number.isInteger(newPrevCursor)
        ? [...Array(10)].map(createMockChat)
        : [],
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

export default [GetChats];
