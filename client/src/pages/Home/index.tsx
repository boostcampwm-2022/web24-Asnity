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
    </div>
  );
};

export default Home;
