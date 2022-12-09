import { useCommunitiesMapQueryData } from '@hooks/community';
import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

/**
 * ### 커뮤니티 아이디가 올바른지 확인하는 레이어
 * - 사용자가 해당 커뮤니티에 속해있다면 유효하며, 다음 페이지로 진행한다.
 * - 사용자가 해당 커뮤니티에 속해있지 않다면 `/dms` 페이지로 리다이렉트한다.
 */
const CommunityLayer = () => {
  const params = useParams();
  const communityId = params.communityId as string;
  const communitiesMapQueryData = useCommunitiesMapQueryData();

  if (!communitiesMapQueryData?.[communityId])
    return <Navigate to="/dms" replace />;

  return <Outlet />;
};

export default CommunityLayer;
