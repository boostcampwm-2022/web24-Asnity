import Followings from '@layouts/Followings';
import Followers from '@pages/Followers';
import UserSearch from '@pages/UserSearch';
import React, { useState } from 'react';

const TAB = {
  FOLLOWINGS: 'followings',
  FOLLOWERS: 'followers',
  USER_SEARCH: 'user-search',
};

const tabs = [
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
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[56px] w-full h-header border-b border-line">
        <ul className="flex gap-[45px]">
          {tabs.map(({ name, tab: t }) => (
            <li
              key={t}
              className={`${tab === t ? 'text-indigo' : 'text-placeholder'
                } font-bold text-s20`}
            >
              <button className="w-[100%]" onClick={() => setTab(t)}>
                {name}
              </button>
            </li>
          ))}
        </ul>
      </header>
      <div className="flex grow">
        <div className="flex-1 min-w-[720px] max-w-[960px]">
          {TabPanel[tab]}
        </div>
        <div className="flex w-72 h-full border-l border-line">
          온라인, 오프라인
        </div>
      </div>
    </div>
  );
};

export default Friends;
