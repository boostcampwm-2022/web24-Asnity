import CommonModal from '@components/Modals/CommonModal';
import ContextMenuModal from '@components/Modals/ContextMenuModal';
import Gnb from '@layouts/Gnb';
import Sidebar from '@layouts/Sidebar';
import Sockets from '@layouts/SocketLayer';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="wrapper flex flex-1">
      <Sockets />
      <Gnb />
      <Sidebar />
      <Outlet />
      <ContextMenuModal />
      <CommonModal />
    </div>
  );
};

export default Home;
