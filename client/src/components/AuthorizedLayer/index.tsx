import useReissueTokenMutation from '@hooks/useReissueTokenMutation';
import { useTokenStore } from '@stores/tokenStore';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// 액세스 토큰은 상태로 저장하고, 초깃값이 null이기 때문에
// 액세스 토큰이 존재한다는 것 자체가 이미 인증이 된 것과 같다.
const AuthorizedLayer = () => {
  const user = useTokenStore((state) => state.user);

  const accessToken = useTokenStore((state) => state.accessToken);

  console.log(`[AuthLayer - ${location.pathname}]`);

  // 1-1. 유저가 있는지 없는지 체크
  // 1-2. 유저가 있으면 통과
  // if (user) return <Outlet />
  // TODO: 준영님 리팩토링 머지 되면 작업할 예정.

  // [X] 2-1. Silent Refresh
  // [X] 2-2. 성공시 통과, 실패시 로그인 페이지로.
  // NOTE: /access-denied 페이지로 이동하는게 맞는 것 같기도?

  const reissueTokenMutation = useReissueTokenMutation('/sign-in');

  useEffect(() => {
    if (user) return;

    // Silent Refresh
    reissueTokenMutation.mutate();
  }, []);

  if (!user && !accessToken) return <div>로딩중...</div>;
  return <Outlet />;
};

export default AuthorizedLayer;
