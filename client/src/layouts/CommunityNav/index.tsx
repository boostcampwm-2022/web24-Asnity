import { useCommunitiesQuery } from '@hooks/community';
import React from 'react';
import { useParams } from 'react-router-dom';

const CommunityNav = () => {
  const { communityId } = useParams();
  const { communitiesQuery } = useCommunitiesQuery();
  const communitySummary = communitiesQuery.data?.find(
    ({ _id }) => _id === communityId,
  );

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none">
        {communitySummary?.name}
      </header>
    </nav>
  );
};

export default CommunityNav;
