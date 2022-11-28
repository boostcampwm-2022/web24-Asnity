import React from 'react';
import { Outlet } from 'react-router-dom';

const Community = () => {
  return (
    <main className="flex flex-col flex-1">
      <Outlet />
    </main>
  );
};

export default Community;
