import React from 'react';
import { useParams } from 'react-router-dom';

const CommunityNav = () => {
  const { communityId } = useParams();

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none">
        {communityId}
      </header>
    </nav>
  );
};

export default CommunityNav;
