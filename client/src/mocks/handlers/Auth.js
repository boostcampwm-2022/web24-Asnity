import { API_URL } from '@constants/url';
import { rest } from 'msw';

import { users } from '../data/users';

const BASE_URL = `${API_URL}/api`;

// 회원가입
const SignUp = rest.post(`${BASE_URL}/user/auth/signup`, (req, res, ctx) => {
  // 응답 메세지 성공-실패를 토글하려면 이 값을 바꿔주세요.
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
});

// 로그인
// 응답 json 데이터로 Access token, 쿠키로 Refresh token을 받는다.
const SignIn = rest.post(`${BASE_URL}/user/auth/signin`, (req, res, ctx) => {
  // 응답 메세지 성공-실패를 토글하려면 이 값을 바꿔주세요.
  const ERROR = false;

  const successResponse = res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json({
      statusCode: 200,
      result: {
        _id: '_id',
        accessToken: 'accessToken',
      },
    }),
  );

  const errorResponse = res(
    ctx.status(400),
    ctx.delay(500),
    ctx.json({
      statusCode: 400,
      message: 'Unknown Error',
      error: '',
    }),
  );

  return ERROR ? errorResponse : successResponse;
});

export const GetMyInfo = rest.get('/api/user/auth/me', (req, res, ctx) => {
  return res(
    ctx.delay(),
    ctx.status(200),
    ctx.json({
      statusCode: 200,
      result: {
        user: users[0],
      },
    }),
  );
});

export default [SignUp, SignIn, GetMyInfo];
