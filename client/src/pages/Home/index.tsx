import Gnb from '@layouts/Gnb';
import Sidebar from '@layouts/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-1 h-screen">
      <Gnb />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Home;
