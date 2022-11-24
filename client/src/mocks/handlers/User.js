import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const GetFilteredUsers = rest.get(`${API_URL}/api/users`, (req, res, ctx) => {
  const query = req.url.searchParams.get('query');

  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        users: users.filter(
          (user) => user.id.includes(query) || user.nickname.includes(query),
        ),
      },
    }),
  );
});

export default [GetFilteredUsers];
