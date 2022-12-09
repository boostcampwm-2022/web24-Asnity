import type { User } from '@apis/user';
import type { FC } from 'react';

import FollowingUserContextMenu from '@components/FollowingUserContextMenu';
import UserItem from '@components/UserItem';
import UserList from '@components/UserList';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useFollowersMapQuery } from '@hooks/user';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  users: User[];
}

/**
 *
 * @returns 팔로잉 목록을 렌더링하는 컴포넌트
 */
const FollowingUserSearchResult: FC<Props> = ({ users }) => {
  const openContextMenuModal = useRootStore(
    (state) => state.openContextMenuModal,
  );

  const followersMapQuery = useFollowersMapQuery();

  const handleMoreButtonClick: (
    user: User,
  ) => React.MouseEventHandler<HTMLButtonElement> = (user) => (e) => {
    openContextMenuModal({
      content: <FollowingUserContextMenu user={user} />,
      contentWrapperStyle: {
        borderRadius: 16,
        left: e.clientX,
        top: e.clientY,
      },
    });
  };

  if (!users.length) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        팔로워가 없거나 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <Scrollbars>
      <UserList>
        {users.map((user) => {
          const isFollowers = !!followersMapQuery.data?.[user._id];

          return (
            <UserItem
              key={user._id}
              user={user}
              left={
                isFollowers && <div className="text-placeholder">맞팔로우</div>
              }
              right={
                <div className="flex gap-4">
                  <button
                    className="p-2 rounded-full border border-line disabled:cursor-not-allowed"
                    onClick={handleMoreButtonClick(user)}
                  >
                    <span className="sr-only">더보기</span>
                    <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
                  </button>
                </div>
              }
            />
          );
        })}
      </UserList>
    </Scrollbars>
  );
};

export default FollowingUserSearchResult;
