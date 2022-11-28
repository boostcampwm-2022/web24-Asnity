import CommunityInviteUserSearchResultBox from '@components/CommunityInviteUserSearchResultBox';
import UserSearch from '@layouts/UserSearch';
import React from 'react';

/**
 * 커뮤니티 초대 모달 컨텐츠 영역을 나타내는 컴포넌트입니다.
 */
const CommunityInviteBox: React.FC = () => {
  return (
    <div className="bg-offWhite min-w-[500px] w-[50vw] h-[70vh]">
      <UserSearch Variant={CommunityInviteUserSearchResultBox} />
    </div>
  );
};

export default CommunityInviteBox;
