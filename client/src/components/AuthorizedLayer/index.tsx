import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthorizedLayer = () => {
  return <Outlet />;
};

export default AuthorizedLayer;
