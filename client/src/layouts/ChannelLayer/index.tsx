import { useCommunitiesMapQueryData } from '@hooks/community';
import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

/**
 * 채널 아이디가 올바른지 확인하는 레이어
 * 사용자가 해당 채널에 속해있다면 올바르다.
 * 올바르지 않다면 `/dms` 페이지로 리다이렉트한다.
 */

const ChannelLayer = () => {
  const params = useParams();
  const communityId = params.communityId as string;
  const roomId = params.roomId as string;
  const communitiesMapQueryData = useCommunitiesMapQueryData();

  if (
    !communitiesMapQueryData?.[communityId].channels.find(
      (channel) => channel._id === roomId,
    )
  )
    return <Navigate to="/dms" replace />;

  return <Outlet />;
};

export default ChannelLayer;
