import { useTokenStore } from '@stores/tokenStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const Root = () => {
  const user = useTokenStore((state) => state.user);
  const accessToken = useTokenStore((state) => state.accessToken);

  // 로그인 되어있으면 dms, 로그인 되어있지 않으면 /sign-in
  // 조건문에 둘 중 하나라도 없으면 /sign-in -> / -> /sign-in ... 무한 루프돕니다.
  if (user || accessToken) return <Navigate to="/dms" replace />;
  return <Navigate to="/sign-in" replace />;
};

export default Root;
