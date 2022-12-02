import { API_URL } from '@constants/url';
import { faker } from '@faker-js/faker';
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
        result: [...users.slice(5, 10)].map((user) => ({
          _id: faker.datatype.uuid(),
          name: '',
          users: [users[0]._id, user._id],
          profileUrl: '',
          description: '',
          managerId: [user._id],
          isPrivate: true,
          type: 'DM',
        })),
      }),
    );
  },
);

export default [GetDirectMessages];
