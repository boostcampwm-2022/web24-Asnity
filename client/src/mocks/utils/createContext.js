/**
 * @param ctx
 * @param status {number}
 * @param delay {number}
 * @param result {any}
 * @returns {[*,*,*]}
 * @description ### `res(...creatSuccessContext(ctx));`와 같이 반드시 스프레드 연산자를 사용하세요.
 */
export const createSuccessContext = (
  ctx,
  status = 200,
  delay = 500,
  result = {},
) => [
  ctx.status(status),
  ctx.delay(delay),
  ctx.json({
    statusCode: status,
    result,
  }),
];

/**
 *
 * @param ctx
 * @param status {number}
 * @param delay {number}
 * @param messages {string | string[]}
 * @param error {string}
 * @returns {[*,*,*]}
 * @description ### `res(...createErrorContext(ctx));`와 같이 반드시 스프레드 연산자를 사용하세요.
 */
export const createErrorContext = (
  ctx,
  status = 400,
  delay = 500,
  messages = '에러가 발생했습니다!',
  error = '',
) => [
  ctx.status(status),
  ctx.delay(delay),
  ctx.json({
    statusCode: status,
    messages,
    error,
  }),
];
