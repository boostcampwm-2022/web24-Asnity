export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

/**
 * @param fn {Function} 실행할 함수
 * @param percent {number} 0 ~ 100 사이의 숫자
 * @param notExecutedReturnValue {any} 실행되지 않았을 때 반환할 값
 * @description n% 확률로 함수를 실행한 결과를 반환.
 */
export const chancify = (fn, percent, notExecutedReturnValue = undefined) => {
  if (percent <= 0) {
    percent = 0;
  }

  if (percent >= 100) {
    percent = 100;
  }

  percent /= 100;

  return Math.random() < percent ? fn() : notExecutedReturnValue;
};
