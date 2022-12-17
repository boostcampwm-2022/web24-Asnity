export const getKoreanTime = () => {
  const curr = new Date();
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

  return new Date(utc + KR_TIME_DIFF);
};
