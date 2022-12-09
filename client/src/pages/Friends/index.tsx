import type { ReactNode } from 'react';

import Followers from '@layouts/Followers';
import Followings from '@layouts/Followings';
import UserSearch from '@layouts/UserSearch';
import React, { useState } from 'react';

const TAB = {
  FOLLOWINGS: 'followings',
  FOLLOWERS: 'followers',
  USER_SEARCH: 'user-search',
} as const;

const tabData = [
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
] as const;

const TabPanel: Record<string, ReactNode> = {
  [TAB.FOLLOWINGS]: <Followings />,
  [TAB.FOLLOWERS]: <Followers />,
  [TAB.USER_SEARCH]: <UserSearch />,
};

const DEFAULT_TAB = TAB.FOLLOWINGS;

const Friends = () => {
  const [tab, setTab] = useState<'followings' | 'followers' | 'user-search'>(
    DEFAULT_TAB,
  );

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[56px] w-full border-b border-line shrink-0 basis-[90px]">
        <ul className="flex gap-[45px]">
          {tabData.map(({ name, tab: _tab }) => (
            <li
              key={_tab}
              className={`${
                // 강제 포맷 방지용 주석
                tab === _tab ? 'text-indigo' : 'text-placeholder'
              } font-bold text-s20`}
            >
              <button className="w-[100%]" onClick={() => setTab(_tab)}>
                {name}
              </button>
            </li>
          ))}
        </ul>
      </header>
      <div className="flex h-full">
        <div className="flex-1 min-w-[720px] max-w-[960px] h-[100%]">
          {TabPanel[tab]}
        </div>
      </div>
    </div>
  );
};

export default Friends;
