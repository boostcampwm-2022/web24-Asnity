import React from 'react';
import { Link } from 'react-router-dom';

const DmNav = () => {
  return (
    <>
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none">
        <Link to="/dms">Direct Message</Link>
      </header>
    </>
  );
};

export default DmNav;
