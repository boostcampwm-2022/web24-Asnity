import type { TabKeys } from '@pages/Friends/static';
import type { ReactNode } from 'react';

import Followers from '@layouts/Followers';
import Followings from '@layouts/Followings';
import UserSearch from '@layouts/UserSearch';
import { TAB_KEY, tabs } from '@pages/Friends/static';
import cn from 'classnames';
import React, { useState } from 'react';

const TabComponent: Record<string, ReactNode> = {
  [TAB_KEY.FOLLOWINGS]: <Followings />,
  [TAB_KEY.FOLLOWERS]: <Followers />,
  [TAB_KEY.USER_SEARCH]: <UserSearch />,
};

const DEFAULT_TAB_KEY = TAB_KEY.FOLLOWINGS;

const Friends = () => {
  const [currentTab, setCurrentTab] = useState<TabKeys>(DEFAULT_TAB_KEY);
  const currentTabComponent = TabComponent[currentTab];

  const handleClickTab = (key: TabKeys) => () => setCurrentTab(key);
  const tabClassnames = (isActive: boolean) =>
    cn(
      {
        'text-indigo': isActive,
        'text-placeholder': !isActive,
      },
      'font-bold',
      'text-s20',
    );

  return (
    <main className="flex flex-col flex-1">
      <div className="w-full h-full flex flex-col">
        <nav className="flex items-center pl-[56px] w-full border-b border-line shrink-0 basis-[90px]">
          <h2 className="sr-only">탭 목록</h2>
          <ul className="flex gap-[45px]">
            {tabs.map(({ tabName, key }) => (
              <li key={key} className={tabClassnames(key === currentTab)}>
                <button className="w-full" onClick={handleClickTab(key)}>
                  {tabName}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex h-full">
          <div className="flex-1 min-w-[720px] max-w-[960px] h-full">
            {currentTabComponent}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Friends;
