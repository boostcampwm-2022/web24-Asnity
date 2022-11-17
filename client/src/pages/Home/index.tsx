import Gnb from '@features/Gnb';
import Sidebar from '@features/Sidebar';
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
