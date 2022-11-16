import Followers from '@pages/Followers';
import Followings from '@pages/Followings';
import UserSearch from '@pages/UserSearch';
import React, { useEffect } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

const TabPanel: Record<string, JSX.Element> = {
  followers: <Followers />,
  followings: <Followings />,
  'user-search': <UserSearch />,
};

const DEFAULT_TAB = 'followings';

const Friends = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!((searchParams.get('tab') ?? '') in TabPanel))
      navigate({ search: `?${createSearchParams([['tab', DEFAULT_TAB]])}` });
  });

  const renderTablPanel = (tab: string) => TabPanel[tab];

  return (
    <main className="flex flex-col">
      <nav>
        <ul className="flex">
          <li>
            <button onClick={() => setSearchParams({ tab: 'followings' })}>
              팔로잉
            </button>
          </li>
          <li>
            <button onClick={() => setSearchParams({ tab: 'followers' })}>
              팔로워
            </button>
          </li>
          <li>
            <button onClick={() => setSearchParams({ tab: 'user-search' })}>
              사용자 검색
            </button>
          </li>
        </ul>
      </nav>
      <div className="content">
        {renderTablPanel(searchParams.get('tab') ?? DEFAULT_TAB)}
      </div>
    </main>
  );
};

export default Friends;
