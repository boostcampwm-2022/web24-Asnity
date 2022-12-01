import UserProfile from '@components/UserProfile';
import { useChannelQuery } from '@hooks/channel';
// import { useMyInfo } from '@hooks/useMyInfoQuery';
import React from 'react';
import { Link } from 'react-router-dom';

const DmNav = () => {
  // const myInfo = useMyInfo();
  // TODO 현재 DM API 없는 관계로 임시로 channel의 사용자 목록 가져오는 API 사용함
  const { channelQuery } = useChannelQuery('dm');

  if (channelQuery.isLoading) return <div>loading</div>;

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          <Link to="/dms">Direct Message</Link>
        </h2>
      </header>
      {channelQuery.isLoading ? (
        <div>loading...</div>
      ) : (
        channelQuery.data && (
          <ul className="flex flex-col p-6 [&>*:hover]:rounded-md [&>*:hover]:bg-offWhite">
            {channelQuery.data.users.map((user) => (
              <li key={user._id}>
                <Link to={`/dms/${user._id}`}>
                  <UserProfile user={user} />
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
