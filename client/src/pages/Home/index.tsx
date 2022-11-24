import Gnb from '@layouts/Gnb';
import Sidebar from '@layouts/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="wrapper flex flex-1">
      <Gnb className="flex flex-col min-w-[80px] w-[80px] h-full bg-background border-r border-line" />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Home;
