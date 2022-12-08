import Spinner from '@components/Spinner';
import React from 'react';

const FullScreenSpinner = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <span className="sr-only">로딩중</span>
      <Spinner size={80} />
    </div>
  );
};

export default FullScreenSpinner;
