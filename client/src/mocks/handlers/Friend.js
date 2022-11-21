import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const BASE_URL = `${API_URL}/api`;

const GetFollowings = rest.get(
  `${BASE_URL}/user/followings`,
  (req, res, ctx) => {
    const query = req.url.searchParams.get('query') ?? '';

    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {
          followings: query
            ? users.filter(({ nickname }) =>
                nickname.toUpperCase().includes(query.toUpperCase()),
              )
            : users,
        },
      }),
    );
  },
);

const UpdateFollowing = rest.post(
  `${BASE_URL}/user/following/:userId`,
  (req, res, ctx) => {
    const { userId } = req.params;
    const idx = users.findIndex((user) => user._id === userId);

    users.splice(idx, 1);
    console.log(users);
    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        result: {},
      }),
    );
  },
);

const FriendHandlers = [GetFollowings, UpdateFollowing];

export default FriendHandlers;
