import DirectMessageUserItem from '@components/DirectMessageUserItem';
import useDirectMessagesQuery from '@hooks/useDirectMessagesQuery';
import { useMyInfo } from '@hooks/useMyInfoQuery';
import React from 'react';
import { Link } from 'react-router-dom';

const DmNav = () => {
  const myInfo = useMyInfo();
  const directMessagesQuery = useDirectMessagesQuery();

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          <Link to="/dms">Direct Message</Link>
        </h2>
      </header>
      {directMessagesQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        directMessagesQuery.data?.length && (
          <ul className="flex flex-col p-6 [&>*:hover]:rounded-md [&>*:hover]:bg-offWhite">
            {directMessagesQuery.data.map((directMessage) => (
              <li key={directMessage._id}>
                <Link to={`/dms/${directMessage._id}`}>
                  <DirectMessageUserItem
                    userId={
                      directMessage.users.filter(
                        (uid) => uid !== myInfo?._id,
                      )[0]
                    }
                  />
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </nav>
  );
};

export default DmNav;
