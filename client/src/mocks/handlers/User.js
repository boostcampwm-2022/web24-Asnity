import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const GetFilteredUsers = rest.get(`${API_URL}/api/users`, (req, res, ctx) => {
  const search = req.url.searchParams.get('search');

  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        users: users.filter(
          (user) => user.id.includes(search) || user.nickname.includes(search),
        ),
      },
    }),
  );
});

export default [GetFilteredUsers];
