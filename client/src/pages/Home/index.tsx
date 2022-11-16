import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex">
      <div>gnb</div>
      <div>sidebar</div>
      <Outlet />
    </div>
  );
};

export default Home;
