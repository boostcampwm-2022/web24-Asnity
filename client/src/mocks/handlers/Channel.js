import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { channels } from '../data/channels';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const BASE_URL = `${API_URL}/api`;

// 채널 목록 가져오기
const GetChannels = rest.get(
  `${BASE_URL}/user/community/:communityId/channels`,
  (req, res, ctx) => {
    const ERROR = false;

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, channels),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetChannels];
