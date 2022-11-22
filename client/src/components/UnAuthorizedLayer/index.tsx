import useReissueTokenMutation from '@hooks/useReissueTokenMutation';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const UnAuthorizedLayer = () => {
  const user = useTokenStore((state) => state.user);

  const accessToken = useTokenStore((state) => state.accessToken);
  const [isInProgress, setIsInProgress] = useState(true);

  // Silent Refresh
  // 성공(로그인 성공) -> / -> /dms
  // 실패(로그인 실패) -> 현재 페이지에 머무름.

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
