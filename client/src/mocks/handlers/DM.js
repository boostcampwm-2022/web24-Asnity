import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const GetDirectMessages = rest.get(
  `${API_URL}/api/user/dms`,
  (req, res, ctx) => {
    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: [...users.slice(0, 5)].map((user, idx) => ({
          _id: idx,
          user,
        })),
      }),
    );
  },
);

export default [GetDirectMessages];
