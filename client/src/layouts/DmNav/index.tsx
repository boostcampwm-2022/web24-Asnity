import UserProfile from '@components/UserProfile';
import useDirectMessagesQuery from '@hooks/useDirectMessagesQuery';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DmNav = () => {
  const naviagte = useNavigate();
  const directMessagesQuery = useDirectMessagesQuery();

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none">
        <Link to="/dms">Direct Message</Link>
      </header>
      {directMessagesQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        directMessagesQuery.data?.length && (
          <ul className="flex flex-col p-6">
            {directMessagesQuery.data.map((directMessage) => (
              <li
                key={directMessage._id}
                className="hover:rounded-md hover:bg-offWhite"
              >
                <button onClick={() => naviagte(`/dms/${directMessage._id}`)}>
                  <UserProfile user={directMessage.user} />
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </nav>
  );
};

export default DmNav;
