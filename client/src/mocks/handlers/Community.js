import { API_URL } from '@constants/url';
import { rest } from 'msw';

const BASE_URL = `${API_URL}/api`;

// 커뮤니티 생성
const createCommunity = rest.post(
  `${BASE_URL}/community`,
  async (req, res, ctx) => {
    const ERROR = false;
    const { name, description } = await req.json();

    const successResponse = res(
      ctx.status(201),
      ctx.delay(500),
      ctx.json({
        statusCode: 201,
        result: {
          name,
          managerId: '6379beb15d4f08bbe0c940e9',
          description,
          profileUrl: 'request profileUrl',
          createdAt: '2022-11-21T10:07:14.390Z',
          updatedAt: '2022-11-21T10:07:14.390Z',
          channels: [],
          users: ['6379beb15d4f08bbe0c940e9'],
          _id: '637b4dd7ec4ba00e3e288930',
          __v: 0,
        },
      }),
    );

    const errorResponse = res(
      ctx.status(401),
      ctx.delay(500),
      ctx.json({
        statusCode: 400,
        messages: '에러가 발생했습니다!',
        error: '',
      }),
    );

    return ERROR ? errorResponse : successResponse;
  },
);

export default [createCommunity];
