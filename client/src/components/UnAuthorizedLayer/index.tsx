import React from 'react';
import { Outlet } from 'react-router-dom';

const UnAuthorizedLayer = () => {
  return <Outlet />;
};

export default UnAuthorizedLayer;
