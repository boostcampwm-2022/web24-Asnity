import React from 'react';
import { Navigate } from 'react-router-dom';

let errorCount = 0;
const HomeErrorElement = () => {
  const maxErrorCount = 3;

  errorCount += 1;

  if (errorCount >= maxErrorCount) {
    errorCount = 0;
    return <Navigate to="/unknown-error" />;
  }

  return <Navigate to="/" />;
};

export default HomeErrorElement;
