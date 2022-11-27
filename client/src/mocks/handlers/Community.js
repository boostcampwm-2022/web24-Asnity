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

const GetCommunity = rest.get(
  `${BASE_URL}/communities/:communityId`,
  (req, res, ctx) => {
    const { communityId } = req.params;
    const ERROR = false;

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(
        ctx,
        200,
        500,
        communities.find((community) => community._id === communityId),
      ),
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

    const newCommunity = {
      name,
      managerId: '6379beb15d4f08bbe0c940e9',
      description,
      profileUrl: '',
      createdAt: '2022-11-21T10:07:14.390Z',
      updatedAt: '2022-11-21T10:07:14.390Z',
      channels: [],
      users: ['6379beb15d4f08bbe0c940e9'],
      _id: crypto.randomUUID(),
      __v: 0,
    };

    const successResponse = res(
      ...createSuccessContext(ctx, 201, 500, newCommunity),
    );

    const errorResponse = res(...createErrorContext(ctx));

    if (!ERROR) {
      // eslint-disable-next-line no-shadow
      const { name, _id, managerId, profileUrl, description } = newCommunity;

      communities.push({
        name,
        _id,
        managerId,
        profileUrl,
        description,
      });
    }

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetCommunities, GetCommunity, CreateCommunity];
