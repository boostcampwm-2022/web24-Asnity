import { rest } from 'msw';

import { users } from '../data';

const GetFollowings = rest.get('/api/followings', (req, res, ctx) => {
  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        followings: users,
      },
    }),
  );
});

const FriendHandlers = [GetFollowings];

export default FriendHandlers;
