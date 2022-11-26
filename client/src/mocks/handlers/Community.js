import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { communities } from '../data/communities';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const BASE_URL = `${API_URL}/api`;

const GetCommunities = rest.get(
  `${BASE_URL}/user/communities`,
  (req, res, ctx) => {
    const ERROR = false;

    const errorResponse = res(...createErrorContext(ctx));

    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, communities),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

// 커뮤니티 생성
const CreateCommunity = rest.post(
  `${BASE_URL}/community`,
  async (req, res, ctx) => {
    const ERROR = false;
    const { name, description } = await req.json();

    const successResponse = res(
      ...createSuccessContext(ctx, 201, 500, {
        name,
        managerId: '6379beb15d4f08bbe0c940e9',
        description,
        profileUrl: 'request profileUrl',
        createdAt: '2022-11-21T10:07:14.390Z',
        updatedAt: '2022-11-21T10:07:14.390Z',
        channels: [],
        users: ['6379beb15d4f08bbe0c940e9'],
        _id: '637b4dd7ec4ba00e3e288930',
        __v: 0,
      }),
    );

    const errorResponse = res(...createErrorContext(ctx));

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetCommunities, CreateCommunity];
