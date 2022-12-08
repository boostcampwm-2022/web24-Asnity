import type { User } from '@apis/user';
import type { FC } from 'react';

import FollowerUserContextMenu from '@components/FollowerUserContextMenu';
import UserItem from '@components/UserItem';
import UserList from '@components/UserList';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useFollowersMapQuery } from '@hooks/useFollowersQuery';
import { useFollowingsMapQuery } from '@hooks/useFollowingsQuery';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  users: User[];
}

/**
 *
 * @returns 사용자 목록을 렌더링하는 컴포넌트
 */
const UserSearchResult: FC<Props> = ({ users }) => {
  const openCommonModal = useRootStore((state) => state.openCommonModal);

  const followersMapQuery = useFollowersMapQuery();
  const followingsMapQuery = useFollowingsMapQuery();

  const handleMoreButtonClick: (
    user: User,
  ) => React.MouseEventHandler<HTMLButtonElement> = (user) => (e) => {
    openCommonModal({
      content: <FollowerUserContextMenu user={user} />,
      overlayBackground: 'transparent',
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
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <Scrollbars>
      <UserList>
        {users.map((user) => {
          const isFollowing = !!followingsMapQuery.data?.[user._id];
          const isFollower = !!followersMapQuery.data?.[user._id];

          return (
            <UserItem
              key={user._id}
              user={user}
              left={
                <div className="flex gap-2 text-placeholder">
                  {isFollowing && isFollower ? (
                    <div>맞팔로우</div>
                  ) : isFollowing ? (
                    <div>팔로잉</div>
                  ) : isFollower ? (
                    <div>팔로워</div>
                  ) : (
                    <></>
                  )}
                </div>
              }
              right={
                isFollowing ? (
                  <div></div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      className="p-2 rounded-full border border-line disabled:cursor-not-allowed"
                      onClick={handleMoreButtonClick(user)}
                    >
                      <span className="sr-only">더보기</span>
                      <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
                    </button>
                  </div>
                )
              }
            />
          );
        })}
      </UserList>
    </Scrollbars>
  );
};

export default UserSearchResult;
