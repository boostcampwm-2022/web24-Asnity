import { useMyInfoQueryData } from '@hooks/auth';
import { useTokenStore } from '@stores/tokenStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @description
 * ## 인증 상태에 따라 리다이렉트 분기처리하는 페이지
 * - 로그인 되어있으면 **`/dms`** 로 이동한다.
 * - 로그인 되어있지 않으면, **`/sign-in`** 으로 이동한다.
 * - 조건문에 user || accessToken 중 하나라도 없으면 **`/sign-in`** -> **`/`** -> **`/sign-in`** ... 무한루프 발생함.
 */
const Root = () => {
  const user = useMyInfoQueryData();
  const accessToken = useTokenStore((state) => state.accessToken);

  if (user || accessToken) return <Navigate to="/dms" replace />;
  return <Navigate to="/sign-in" replace />;
};

export default Root;
