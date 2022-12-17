import FullScreenSpinner from '@components/FullScreenSpinner';
import { useMyInfoQueryData, useReissueTokenMutation } from '@hooks/auth';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

/**
 * ## 로그인 하지 않은 유저들만 머무를 수 있는 페이지.
 * - 새로고침시 토큰 갱신을 시도하며, 로그인한(유저 상태나 액세스 토큰 상태가 있는) 유저가 접근하면 **`/`** 로 리다이렉트된다.
 * - 토큰 갱신 요청시, 유효하지 않은 토큰 에러나 알 수 없는 에러가 발생하면 페이지 이동 없이 그대로 유지한다.
 */
const UnAuthorizedLayer = () => {
  const user = useMyInfoQueryData();
  const location = useLocation();

  const accessToken = useTokenStore((state) => state.accessToken);
  const [isTryingReissueToken, setIsTryingReissueToken] = useState(true);

  const handleReissueTokenError = () => setIsTryingReissueToken(false);

  const reissueTokenMutation = useReissueTokenMutation(
    handleReissueTokenError,
    handleReissueTokenError,
  );

  useEffect(() => {
    if (user) return;
    reissueTokenMutation.mutate();
  }, []);

  if (user || accessToken) return <Navigate to="/" replace />;
  if (location.state?.alreadyTriedReissueToken) return <Outlet />;
  if (isTryingReissueToken) return <FullScreenSpinner />;
  return <Outlet />;
};

export default UnAuthorizedLayer;
