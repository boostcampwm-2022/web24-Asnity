import useReissueTokenMutation from '@hooks/useReissueTokenMutation';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

/**
 * @description
 * ## 로그인 하지 않은 유저들만 머무를 수 있는 페이지.
 * - 새로고침시 토큰 갱신을 시도하며, 로그인한(유저 상태나 액세스 토큰 상태가 있는) 유저가 접근하면 **`/`** 로 리다이렉트된다.
 * - 토큰 갱신 요청시, 유효하지 않은 토큰 에러나 알 수 없는 에러가 발생하면 페이지 이동 없이 그대로 유지한다.
 */
const UnAuthorizedLayer = () => {
  const user = useTokenStore((state) => state.user);

  const accessToken = useTokenStore((state) => state.accessToken);
  const [isInProgress, setIsInProgress] = useState(true);

  const complete = () => setIsInProgress(false);

  const reissueTokenMutation = useReissueTokenMutation(complete, complete);

  useEffect(() => {
    if (user) return;

    reissueTokenMutation.mutate();
  }, []);

  if (user || accessToken) return <Navigate to="/" replace />;
  if (isInProgress) return <div>로딩중...</div>;
  return <Outlet />;
};

export default UnAuthorizedLayer;
