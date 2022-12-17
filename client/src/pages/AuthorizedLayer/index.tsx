import FullScreenSpinner from '@components/FullScreenSpinner';
import { useMyInfoQueryData, useReissueTokenMutation } from '@hooks/auth';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

/**
 * ## 로그인 한 유저들만 머무를 수 있는 페이지.
 * - 새로고침시 토큰 갱신을 시도하며, 로그인하지 않은(유저 상태나 액세스 토큰 상태가 없는) 유저가 접근하면 **`/`** 로 리다이렉트된다.
 * - 토큰 갱신 요청시, 유효하지 않은 토큰 에러가 발생하면 **`/sign-in`** 으로 리다이렉트 된다.
 * - 토큰 갱신 요청시, 알 수 없는 에러가 발생하면 **`/error`** 로 리다이렉트 된다.
 */
const AuthorizedLayer = () => {
  const user = useMyInfoQueryData();

  const accessToken = useTokenStore((state) => state.accessToken);
  const navigate = useNavigate();

  const reissueTokenMutation = useReissueTokenMutation(
    () => {
      navigate('/sign-in', { state: { alreadyTriedReissueToken: true } });
    },
    () => {
      navigate('/error', {
        state: {
          summary: '로그인중 오류가 발생했습니다. 잠시 뒤에 다시 시도해주세요.',
        },
      });
    },
  );

  useEffect(() => {
    if (user || accessToken) return;

    reissueTokenMutation.mutate();
  }, []);

  if (!user && !accessToken) return <FullScreenSpinner />;
  return <Outlet />;
};

export default AuthorizedLayer;
