import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const getFollowingsEndPoint = API_URL + endPoint.getFollowings();
const GetFollowings = rest.get(getFollowingsEndPoint, (req, res, ctx) => {
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

const toggleFollowingEndPoint = API_URL + endPoint.toggleFollowing(':userId');
const UpdateFollowing = rest.post(toggleFollowingEndPoint, (req, res, ctx) => {
  const { userId } = req.params;
  const idx = users.findIndex((user) => user._id === userId);

  users.splice(idx, 1);

  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {},
    }),
  );
});

const getFollowersEndPoint = API_URL + endPoint.getFollowers();
const GetFollowers = rest.get(getFollowersEndPoint, (req, res, ctx) => {
  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        followers: users,
      },
    }),
  );
});

const FriendHandlers = [GetFollowings, UpdateFollowing, GetFollowers];

export default FriendHandlers;
