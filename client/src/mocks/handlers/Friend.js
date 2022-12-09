import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users, followers, followings } from '../data/users';

const getFollowingsEndPoint = API_URL + endPoint.getFollowings();
const GetFollowings = rest.get(getFollowingsEndPoint, (req, res, ctx) => {
  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        followings,
      },
    }),
  );
});

const toggleFollowingEndPoint = API_URL + endPoint.toggleFollowing(':userId');
const toggleFollowing = rest.post(toggleFollowingEndPoint, (req, res, ctx) => {
  const { userId } = req.params;
  const idx = followings.findIndex((user) => user._id === userId);

  // 팔로잉 목록에 없으면 팔로잉 목록에 추가
  if (idx === -1) followings.push(users.find((user) => user._id === userId));
  // 팔로잉 목록에 있으면 팔로잉 목록에서 삭제
  else followings.splice(idx, 1);

  console.log(followings);
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
        followers,
      },
    }),
  );
});

const FriendHandlers = [GetFollowings, toggleFollowing, GetFollowers];

export default FriendHandlers;
