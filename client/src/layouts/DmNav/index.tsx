import Spinner from '@components/Spinner';
import UserProfile from '@components/UserProfile';
import { useChannelQuery } from '@hooks/channel';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Link } from 'react-router-dom';

const DmNav = () => {
  // const myInfo = useMyInfo();
  // TODO 현재 DM API 없는 관계로 임시로 channel의 사용자 목록 가져오는 API 사용함
  const { channelQuery } = useChannelQuery('dm');

  return (
    <nav className="flex flex-col flex-1 h-full">
      <header className="flex shrink-0 items-center px-[10px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          <Link to="/dms">Direct Message</Link>
        </h2>
      </header>
      <Scrollbars>
        {channelQuery.isLoading ? (
          <Spinner
            className="flex justify-center items-center h-full"
            size={40}
          />
        ) : (
          channelQuery.data && (
            <ul className="flex flex-col p-3 [&>*:hover]:rounded-md [&>*:hover]:bg-offWhite">
              {channelQuery.data.users.map((user) => (
                <li key={user._id} className="px-3 py-1">
                  <Link to={`/dms/${user._id}`}>
                    <UserProfile user={user} />
                  </Link>
                </li>
              ))}
            </ul>
          )
        )}
      </Scrollbars>
    </nav>
  );
};

export default DmNav;
