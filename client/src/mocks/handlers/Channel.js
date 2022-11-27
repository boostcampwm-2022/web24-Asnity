import { API_URL } from '@constants/url';
import { faker } from '@faker-js/faker';
import { rest } from 'msw';

import { channels } from '../data/channels';
import { users } from '../data/users';
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

const GetChannel = rest.get(
  `${BASE_URL}/channels/:channelId`,
  (req, res, ctx) => {
    const { channelId } = req.params;
    const ERROR = false;

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, {
        ...channels.find((channel) => channel.id === channelId),
        communityId: faker.datatype.uuid(),
        type: 'Channel',
        users: users.slice(3, 10).map((user) => user._id),
        chatLists: [],
        createdAt: '2022-11-25T17:32:09.085Z',
        updatedAt: '2022-11-25T17:32:09.085Z',
      }),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetChannels, GetChannel];