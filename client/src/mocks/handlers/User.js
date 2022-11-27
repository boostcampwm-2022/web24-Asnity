import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const GetFilteredUsers = rest.get(`${API_URL}/api/users`, (req, res, ctx) => {
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

const GetUser = rest.get(`${API_URL}/api/users/:userId`, (req, res, ctx) => {
  const ERROR = false;

  const errorResponse = res(...createErrorContext(ctx));
  const successResponse = res(...createSuccessContext(ctx, 200, 500, users[0]));

  return ERROR ? errorResponse : successResponse;
});

export default [GetFilteredUsers, GetUser];
