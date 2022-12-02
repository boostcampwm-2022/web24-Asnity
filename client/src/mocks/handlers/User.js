import endPoint from '@constants/endPoint';
import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { communityUsers, users } from '../data/users';
import {
  createErrorContext,
  createSuccessContext,
} from '../utils/createContext';

const getUsersEndPoint = API_URL + endPoint.getUsers();

const GetUsers = rest.get(getUsersEndPoint, (req, res, ctx) => {
  const search = req.url.searchParams.get('search').toUpperCase();

  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        users: users.filter(
          (user) =>
            user.id.toUpperCase().includes(search) ||
            user.nickname.toUpperCase().includes(search),
        ),
      },
    }),
  );
});

const getCommunityUsersEndPoint =
  API_URL + endPoint.getCommunityUsers(':communityId');
const GetCommunityUsers = rest.get(
  getCommunityUsersEndPoint,
  (req, res, ctx) => {
    const ERROR = false;

    // communityUsers는 users의 부분집합
    // 커뮤니티 초대 모달에서 유저를 검색하면, 일부는 이미 커뮤니티에 속해있는 것을 재현할 수 있음.

    const errorResponse = res(...createErrorContext(ctx));
    const successResponse = res(
      ...createSuccessContext(ctx, 200, 500, { users: communityUsers }),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

export default [GetUsers, GetCommunityUsers];
