import AlertModal from '@components/Modals/AlertModal';
import CommonModal from '@components/Modals/CommonModal';
import ContextMenuModal from '@components/Modals/ContextMenuModal';
import CreateCommunityModal from '@components/Modals/CreateCommunityModal';
import Gnb from '@layouts/Gnb';
import Sidebar from '@layouts/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="wrapper flex flex-1">
      <Gnb />
      <Sidebar />
      <Outlet />
      <CreateCommunityModal />
      <ContextMenuModal />
      <AlertModal />
      <CommonModal />
    </div>
  );
};

export default Home;
