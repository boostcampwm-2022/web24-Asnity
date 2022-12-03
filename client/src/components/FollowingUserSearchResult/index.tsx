import type { User } from '@apis/user';
import type { FC } from 'react';

import UserItem from '@components/UserItem';
import UserList from '@components/UserList';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import useFollowersQuery from '@hooks/useFollowersQuery';
import useFollowingMutation from '@hooks/useFollowingMutation';
import { useInvalidateFollowingsQuery } from '@hooks/useFollowingsQuery';
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
  const followersQuery = useFollowersQuery();
  const invalidateFollowingsQuery = useInvalidateFollowingsQuery();
  const followingMutation = useFollowingMutation({
    onSuccess: () => {
      invalidateFollowingsQuery();
    },
    onError: (error) => defaultErrorHandler(error),
  });

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
        {users.map((user) => (
          <UserItem
            key={user._id}
            user={user}
            left={
              !!followersQuery.data?.find((f) => f._id === user._id) && (
                <div className="text-placeholder">팔로워</div>
              )
            }
            right={
              <div className="flex gap-4">
                <button
                  className="p-2 rounded-full border border-line disabled:cursor-not-allowed"
                  onClick={() => followingMutation.mutate(user._id)}
                  disabled={followingMutation.isLoading}
                >
                  <span className="sr-only">더보기</span>
                  <EllipsisHorizontalIcon className="w-6 h-6 fill-indigo" />
                </button>
              </div>
            }
          />
        ))}
      </UserList>
    </Scrollbars>
  );
};

export default FollowingUserSearchResult;
