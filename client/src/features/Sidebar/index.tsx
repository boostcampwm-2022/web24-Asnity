import CommunityNav from '@features/CommunityNav';
import DmNav from '@features/DmNav';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col w-80 h-full bg-background border-r border-line">
      <nav className="flex flex-col flex-1">
        {pathname.startsWith('/dms') ? <DmNav /> : <CommunityNav />}
      </nav>
      <div className="flex w-full h-20 bg-inputBackground border-t border-line">
        user profile
      </div>
    </div>
  );
};

export default Sidebar;
