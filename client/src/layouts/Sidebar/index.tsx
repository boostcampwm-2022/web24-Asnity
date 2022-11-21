import UserProfile from '@components/UserProfile';
import CommunityNav from '@features/CommunityNav';
import DmNav from '@features/DmNav';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';

const getMyInfo = () => axios.get('/api/user/auth/me').then((res) => res.data);

const Sidebar = () => {
  const { pathname } = useLocation();
  const { isLoading, data } = useQuery(['me'], getMyInfo);

  return (
    <div className="flex flex-col min-w-[320px] w-[320px] h-full bg-background border-r border-line">
      <nav className="flex flex-col flex-1">
        {pathname.startsWith('/dms') ? <DmNav /> : <CommunityNav />}
      </nav>
      <div className="flex justify-between items-center w-full px-4 bg-inputBackground border-t border-line">
        {isLoading ? 'loading' : <UserProfile user={data.result.user} />}
        <button>
          <Cog6ToothIcon className="w-7 h-7 fill-label" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
