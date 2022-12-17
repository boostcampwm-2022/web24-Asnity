import React from 'react';
import { Navigate } from 'react-router-dom';

let errorCount = 0;
const HomeErrorElement = () => {
  const maxErrorCount = 3;

  errorCount += 1;

  if (errorCount >= maxErrorCount) {
    errorCount = 0;
    return (
      <Navigate
        to="/error"
        state={{
          summary:
            '알 수 없는 에러가 여러번 감지되었습니다. 잠시 뒤에 다시 시도해주세요.',
        }}
      />
    );
  }

  return <Navigate to="/" />;
};

export default HomeErrorElement;
