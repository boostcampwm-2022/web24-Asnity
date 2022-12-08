import type { MouseEventHandler } from 'react';

import MyPanel from '@components/MyPanel';
import Spinner from '@components/Spinner';
import useMyInfoQuery from '@hooks/useMyInfoQuery';
import CommunityNav from '@layouts/CommunityNav';
import DmNav from '@layouts/DmNav';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();
  const myInfoQuery = useMyInfoQuery();

  const handleRightClickSidebar: MouseEventHandler<HTMLDivElement> = (e) =>
    e.preventDefault();

  return (
    <div
      className="flex flex-col min-w-[320px] w-[320px] h-full bg-background border-r border-line"
      onContextMenu={handleRightClickSidebar}
    >
      <div className="flex-1">
        {pathname.startsWith('/dms') ? <DmNav /> : <CommunityNav />}
      </div>
      <div className="flex justify-between items-center w-full bg-inputBackground border-t border-line">
        {myInfoQuery.isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size={40} />
          </div>
        ) : (
          myInfoQuery.data && <MyPanel me={myInfoQuery.data} />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
