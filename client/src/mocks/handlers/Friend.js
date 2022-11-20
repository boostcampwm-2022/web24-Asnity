import { rest } from 'msw';

import { users } from '../data';

const GetFollowings = rest.get('/api/users/followings', (req, res, ctx) => {
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
});

const FriendHandlers = [GetFollowings];

export default FriendHandlers;
