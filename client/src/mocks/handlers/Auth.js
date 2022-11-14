import { rest } from 'msw';

export const GetUser = rest.get('/users', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(1000),
    ctx.json({
      statusCode: 200,
      result: {
        nickname: '닉네임',
      },
    }),
  );
});
