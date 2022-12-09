import type { CommunitySummary } from '@apis/community';
import type { FC } from 'react';

import CommunityInviteBox from '@components/CommunityInviteBox';
import CommunityLeaveBox from '@components/CommunityLeaveBox';
import {
  UserPlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid';
import { useCommunityUsersQuery } from '@hooks/user';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

interface Props {
  community: CommunitySummary;
}

const CommunityContextMenu: FC<Props> = ({ community }) => {
  const openCommonModal = useRootStore((state) => state.openCommonModal);

  useCommunityUsersQuery(community._id);

  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const handleClickCommunityLeaveButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <CommunityLeaveBox community={community} />,
      overlayBackground: 'black',
      contentWrapperStyle: {
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
    });
  };

  const handleClickCommunitySettingsButton = () => {};

  const handleClickUserInviteButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <CommunityInviteBox communityId={community._id} />,
      overlayBackground: 'black',
      contentWrapperStyle: {
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
    });
  };

  return (
    <section className="w-[300px] p-[16px]">
      <h3 className="sr-only">커뮤니티 컨텍스트 메뉴</h3>
      <ul>
        <li className="mb-[8px]">
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
            onClick={handleClickUserInviteButton}
          >
            <span>커뮤니티에 초대하기</span>
            <UserPlusIcon className="w-6 h-6 pointer-events-none text-placeholder" />
          </button>
        </li>
        <li className="mb-[8px]">
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
            onClick={handleClickCommunitySettingsButton}
          >
            <span>커뮤니티 설정하기</span>
            <Cog6ToothIcon className="w-6 h-6 pointer-events-none text-placeholder" />
          </button>
        </li>
      </ul>
      <div className="px-[12px] mb-[8px]">
        <div className="w-full h-[1px] bg-line mx-auto"></div>
      </div>
      <div>
        <button
          className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
          onClick={handleClickCommunityLeaveButton}
        >
          <span>커뮤니티에서 나가기</span>
          <ArrowRightOnRectangleIcon className="w-6 h-6 pointer-events-none text-error" />
        </button>
      </div>
    </section>
  );
};

export default CommunityContextMenu;
