import { rest } from 'msw';

import { users } from '../data';

export const GetMyInfo = rest.get('/api/user/auth/me', (req, res, ctx) => {
  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        user: users[0],
      },
    }),
  );
});

const AuthHandlers = [GetMyInfo];

export default AuthHandlers;
