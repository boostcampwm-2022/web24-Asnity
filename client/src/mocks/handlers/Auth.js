import { API_URL } from '@constants/url';
import { rest } from 'msw';

const BASE_URL = `${API_URL}/api`;

export const PostUser = rest.post(
  `${BASE_URL}/user/auth/signup`,
  (req, res, ctx) => {
    const ERROR = true;

    const errorResponse = res(
      ctx.status(400),
      ctx.delay(500),
      ctx.json({
        statusCode: 403,
        message: '에러가 발생했습니다.',
        error: 'Forbidden',
      }),
    );

    const successResponse = res(
      ctx.status(201),
      ctx.delay(500),
      ctx.json({
        statusCode: 201,
        result: {
          message: '회원가입 성공',
        },
      }),
    );

    return ERROR ? errorResponse : successResponse;
  },
);
