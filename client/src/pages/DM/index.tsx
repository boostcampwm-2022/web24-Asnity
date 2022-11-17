import React from 'react';
import { Outlet } from 'react-router-dom';

const DM = () => {
  return (
    <main className="flex flex-col flex-1">
      <Outlet />
    </main>
  );
};

export default DM;
