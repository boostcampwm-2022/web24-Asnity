import type { User, UserStatus } from '@apis/user';
import type { FC } from 'react';

import UserProfile from '@components/UserProfile';
import { USER_STATUS } from '@constants/user';
import React from 'react';

interface Props {
  users: User[];
}

const ChannelUserStatus: FC<Props> = ({ users }) => {
  const sorted = users.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.status]: [...acc[cur.status], cur],
    }),
    Object.values(USER_STATUS).reduce(
      (_acc, _cur) => ({ ..._acc, [_cur]: [] }),
      {},
    ) as { [key in UserStatus]: User[] },
  );

  return (
    <div className="w-full h-full overflow-auto no-display-scrollbar">
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex flex-col gap-2 border-b border-line">
          <h2 className="p-2 rounded-md text-s18 font-bold">온라인</h2>
          <div className="flex justify-center items-center min-h-[100px]">
            {sorted.ONLINE.length ? (
              <div className="w-full">
                <ul>
                  {sorted.ONLINE.map((user) => (
                    <li key={user._id}>
                      <UserProfile user={user} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>현재 온라인 사용자가 없어요</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-line">
          <h2 className="p-2 rounded-md text-s18 font-bold">오프라인</h2>
          <div className="flex justify-center items-center min-h-[100px]">
            {sorted.OFFLINE.length ? (
              <div className="w-full">
                <ul>
                  {sorted.OFFLINE.map((user) => (
                    <li key={user._id}>
                      <UserProfile user={user} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>현재 오프라인 사용자가 없어요</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-line">
          <h2 className="p-2 rounded-md text-s18 font-bold">자리 비움</h2>
          <div className="flex justify-center items-center min-h-[100px]">
            {sorted.AFK.length ? (
              <div className="w-full">
                <ul>
                  {sorted.AFK.map((user) => (
                    <li key={user._id}>
                      <UserProfile user={user} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>현재 자리 비운 사용자가 없어요</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelUserStatus;
