import UserProfile from '@components/UserProfile';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import CommunityNav from '@layouts/CommunityNav';
import DmNav from '@layouts/DmNav';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';

const getMyInfo = () => axios.get('/api/user/auth/me').then((res) => res.data);

const Sidebar = () => {
  const { pathname } = useLocation();

  // TODO: 쿼리 컨벤션으로 바꾸기!
  const { isLoading, data } = useQuery(['me'], getMyInfo);

  // TODO: DMNav와 CommunityNav가 좀 더 정확한 의미를 갖도록 바꾸기!
  return (
    <div className="flex flex-col min-w-[320px] w-[320px] h-full bg-background border-r border-line">
      <nav className="flex flex-col flex-1">
        {pathname.startsWith('/dms') ? <DmNav /> : <CommunityNav />}
      </nav>
      <div className="flex justify-between items-center w-full px-4 bg-inputBackground border-t border-line">
        {/* TODO: ...Query.isLoading ? ... 로 바꾸기!  */}
        {isLoading ? 'loading' : <UserProfile user={data.result.user} />}
        <button>
          <span className="sr-only">환경설정</span>
          <Cog6ToothIcon className="w-[28px] h-auto fill-label" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
