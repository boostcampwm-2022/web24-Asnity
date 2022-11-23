import { useMyInfo } from '@hooks/useMyInfoQuery';
import useReissueTokenMutation from '@hooks/useReissueTokenMutation';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

/**
 * ## 로그인 한 유저들만 머무를 수 있는 페이지.
 * - 새로고침시 토큰 갱신을 시도하며, 로그인하지 않은(유저 상태나 액세스 토큰 상태가 없는) 유저가 접근하면 **`/`** 로 리다이렉트된다.
 * - 토큰 갱신 요청시, 유효하지 않은 토큰 에러가 발생하면 **`/sign-in`** 으로 리다이렉트 된다.
 * - 토큰 갱신 요청시, 알 수 없는 에러가 발생하면 **`/unknown-error`** 로 리다이렉트 된다.
 */
const AuthorizedLayer = () => {
  const user = useMyInfo();

  const accessToken = useTokenStore((state) => state.accessToken);
  const navigate = useNavigate();

  const reissueTokenMutation = useReissueTokenMutation(() => {
    navigate('/sign-in', { state: { alreadyTriedReissueToken: true } });
  }, '/unknown-error');

  useEffect(() => {
    if (user) return;

    reissueTokenMutation.mutate();
  }, []);

  if (!(user || accessToken)) return <div>로딩중...</div>; // Spinner 넣기
  return <Outlet />;
};

export default AuthorizedLayer;
