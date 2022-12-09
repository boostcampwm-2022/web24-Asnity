import type { User } from '@apis/user';
import type { FC } from 'react';

import defaultErrorHandler from '@errors/defaultErrorHandler';
import { UserPlusIcon } from '@heroicons/react/20/solid';
import { useInvalidateFollowingsQuery } from '@hooks/useFollowingsQuery';
import { useFollowingMutation } from '@hooks/user';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

interface Props {
  user: User;
}

const FollowerUserContextMenu: FC<Props> = ({ user }) => {
  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const invalidateFollowingsQuery = useInvalidateFollowingsQuery();
  const followingMutation = useFollowingMutation({
    onSuccess: () => {
      invalidateFollowingsQuery();
    },
    onError: (error) => defaultErrorHandler(error),
  });

  const handleUnfollowButtonClick = () => {
    followingMutation.mutate(user._id);
    closeContextMenuModal(); /* TODO: 모달 안 닫히는 문제 있음 */
  };

  return (
    <section className="w-[300px] p-[16px]">
      <h3 className="sr-only">팔로잉 컨텍스트 메뉴</h3>
      <ul>
        <li>
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
            onClick={handleUnfollowButtonClick}
            disabled={followingMutation.isLoading}
          >
            <span>팔로잉하기</span>
            <UserPlusIcon className="w-6 h-6 pointer-events-none" />
          </button>
        </li>
      </ul>
    </section>
  );
};

export default FollowerUserContextMenu;
