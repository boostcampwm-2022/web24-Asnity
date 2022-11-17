import Followers from '@pages/Followers';
import Followings from '@pages/Followings';
import UserSearch from '@pages/UserSearch';
import React, { useState } from 'react';

const TAB = {
  FOLLOWINGS: 'followings',
  FOLLOWERS: 'followers',
  USER_SEARCH: 'user-search',
};

const TABS = [
  {
    name: '팔로잉',
    tab: 'followings',
  },
  {
    name: '팔로워',
    tab: 'followers',
  },
  {
    name: '사용자 검색',
    tab: 'user-search',
  },
];

const TabPanel: Record<string, JSX.Element> = {
  [TAB.FOLLOWINGS]: <Followings />,
  [TAB.FOLLOWERS]: <Followers />,
  [TAB.USER_SEARCH]: <UserSearch />,
};

const DEFAULT_TAB = TAB.FOLLOWINGS;

const Friends = () => {
  const [tab, setTab] = useState(DEFAULT_TAB);

  return (
    <>
      <header className="flex items-center pl-[55px] w-full h-header border-b border-line">
        <ul className="flex gap-[45px]">
          {TABS.map(({ name, tab: t }) => (
            <li
              key={t}
              className={`${tab === t ? 'text-indigo' : 'text-placeholder'
                } font-bold text-[24px]`}
            >
              <button onClick={() => setTab(t)}>{name}</button>
            </li>
          ))}
        </ul>
      </header>
      <div className="flex flex-1 relative">
        <div className="flex-1">{TabPanel[tab]}</div>
        <div className="flex w-[443px] h-full border-l border-line">
          온라인, 오프라인
        </div>
      </div>
    </>
  );
};

export default Friends;
