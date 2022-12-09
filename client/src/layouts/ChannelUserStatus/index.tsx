import type { User, UserStatus } from '@apis/user';
import type { FC } from 'react';

import UserProfile from '@components/UserProfile';
import { USER_STATUS } from '@constants/user';
import React, { useMemo } from 'react';

interface Props {
  users: User[];
}

/**
 *
 * @param users 사용자의 목록
 * @returns 키가 `UserStatus`고 값이 사용자의 목록인 객체. 단 OFFLINE과 AFK는 OFFLINE으로 본류된다.
 */
const groupUserByStatus = (users: User[]) =>
  users.reduce((acc, cur) => {
    const status =
      cur.status === USER_STATUS.OFFLINE
        ? USER_STATUS.OFFLINE
        : USER_STATUS.ONLINE;

    return { ...acc, [status]: [...acc[status], cur] };
  }, Object.values(USER_STATUS).reduce((_acc, _cur) => ({ ..._acc, [_cur]: [] }), {}) as Record<UserStatus, User[]>);

const ChannelUserStatus: FC<Props> = ({ users }) => {
  const groupedUserByStatus = useMemo(() => groupUserByStatus(users), [users]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute w-full h-full overflow-auto no-display-scrollbar">
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex flex-col gap-2 border-b border-line">
            <h2 className="p-2 rounded-md text-s18 font-bold">온라인</h2>
            <div className="flex justify-center items-center min-h-[100px]">
              {groupedUserByStatus.ONLINE.length ? (
                <div className="w-full">
                  <ul>
                    {groupedUserByStatus.ONLINE.map((user) => (
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
              {groupedUserByStatus.OFFLINE.length ? (
                <div className="w-full">
                  <ul>
                    {groupedUserByStatus.OFFLINE.map((user) => (
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
        </div>
      </div>
    </div>
  );
};

export default ChannelUserStatus;
