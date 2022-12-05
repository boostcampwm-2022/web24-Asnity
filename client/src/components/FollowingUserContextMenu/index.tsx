import type { User } from '@apis/user';
import type { FC } from 'react';

import defaultErrorHandler from '@errors/defaultErrorHandler';
import { UserMinusIcon } from '@heroicons/react/20/solid';
import useFollowingMutation from '@hooks/useFollowingMutation';
import { useInvalidateFollowingsQuery } from '@hooks/useFollowingsQuery';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

interface Props {
  user: User;
}

const FollowingUserContextMenu: FC<Props> = ({ user }) => {
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
    <section className="w-[300px] p-[16px] rounded-[10px] border border-line">
      <h3 className="sr-only">팔로잉 컨텍스트 메뉴</h3>
      <ul>
        <li>
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px] "
            onClick={handleUnfollowButtonClick}
          >
            <span>언팔로우하기</span>
            <UserMinusIcon className="w-6 h-6 pointer-events-none text-error" />
          </button>
        </li>
      </ul>
    </section>
  );
};

export default FollowingUserContextMenu;