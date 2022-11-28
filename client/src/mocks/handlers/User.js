import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const BASE_URL = `${API_URL}/api`;

const GetFilteredUsers = rest.get(`${BASE_URL}/users`, (req, res, ctx) => {
  const search = req.url.searchParams.get('search').toUpperCase();

  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        users: users.filter(
          (user) =>
            user.id.toUpperCase().includes(search) ||
            user.nickname.toUpperCase().includes(search),
        ),
      },
    }),
  );
});

const GetUser = rest.get(`${BASE_URL}/users/:userId`, (req, res, ctx) => {
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(...createSuccessContext(ctx, 200, 500, users[0]));

  return ERROR ? errorResponse : successResponse;
});

const GetCommunityUsers = rest.get(
  `${BASE_URL}/community/:communityId/participants`,
  (req, res, ctx) => {
    const ERROR = false;

    const communityUsers = [...users];

    // users는 사용자 배열이고, communityUsers는 그중 일부만 가져와서
    // 커뮤니티 초대 모달에서 유저를 검색하면, 일부는 이미 커뮤니티에 속해있는 것을 재현할 수 있음.
    communityUsers.splice(0, 10);

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, { users: communityUsers }),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetFilteredUsers, GetUser, GetCommunityUsers];
