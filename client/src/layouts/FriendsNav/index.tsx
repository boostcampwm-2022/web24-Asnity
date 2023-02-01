import React from 'react';
import { Link } from 'react-router-dom';

const FriendsNav = () => {
  return (
    <nav className="flex flex-col flex-1 h-full">
      <header className="flex shrink-0 items-center px-[10px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          <Link to="/friends">Friends</Link>
        </h2>
      </header>
    </nav>
  );
};

export default FriendsNav;
