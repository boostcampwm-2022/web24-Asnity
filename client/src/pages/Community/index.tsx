import ChannelInfoLayer from '@layouts/ChannelInfoLayer';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Community = () => {
  return (
    <main className="flex flex-col flex-1">
      <Outlet />
      <ChannelInfoLayer />
    </main>
  );
};

export default Community;
