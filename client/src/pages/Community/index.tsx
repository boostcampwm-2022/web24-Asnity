import React from 'react';
import { Outlet } from 'react-router-dom';

const Community = () => {
  return (
    <div>
      <div>CommunityLayer</div>
      <Outlet />
    </div>
  );
};

export default Community;
