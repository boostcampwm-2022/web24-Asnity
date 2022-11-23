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
  const user = useTokenStore((state) => state.user);

  const accessToken = useTokenStore((state) => state.accessToken);
  const navigate = useNavigate();

  // 1-1. 유저가 있는지 없는지 체크
  // 1-2. 유저가 있으면 통과
  // if (user) return <Outlet />
  // TODO: 준영님 리팩토링 머지 되면 작업할 예정.

  // Silent Refresh
  // 성공시 현재 페이지 그대로 렌더링
  // 유효하지 않은 토큰 에러: /sign-in (/access-denied 페이지로 이동하는게 맞는 것 같기도?)
  // 알 수 없는 에러: /unknown-error

  const reissueTokenMutation = useReissueTokenMutation(() => {
    navigate('/sign-in', { state: { alreadyTriedReissueToken: true } });
  }, '/unknown-error');

  useEffect(() => {
    if (user) return;

    reissueTokenMutation.mutate();
  }, []);

  if (!user && !accessToken) return <div>로딩중...</div>; // Spinner 넣기
  return <Outlet />;
};

export default AuthorizedLayer;
