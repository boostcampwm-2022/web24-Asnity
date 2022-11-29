import type { CommunitySummary } from '@apis/community';
import type { Store } from '@stores/rootStore';
import type { MouseEventHandler, FC } from 'react';

import CommunityInviteBox from '@components/CommunityInviteBox';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import {
  UserPlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid';
import {
  useLeaveCommunityMutation,
  useSetCommunitiesQuery,
} from '@hooks/community';
import { useCommunityUsersQuery } from '@hooks/user';
import { useRootStore } from '@stores/rootStore';
import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  community: CommunitySummary;
}

const CommunityContextMenu: FC<Props> = ({ community }) => {
  const params = useParams();
  const navigate = useNavigate();
  const handleRightClickContextMenu: MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      e.preventDefault();
    }, []);

  const leaveCommunityMutation = useLeaveCommunityMutation();
  const setCommunities = useSetCommunitiesQuery();

  useCommunityUsersQuery(community._id);

  const openAlertModal = useRootStore((state) => state.openAlertModal);
  const closeAlertModal = useRootStore((state) => state.closeAlertModal);
  const disableAlertModal = useRootStore((state) => state.disableAlertModal);
  const enableAlertModal = useRootStore((state) => state.enableAlertModal);

  const openCommonModal = useRootStore((state: Store) => state.openCommonModal);

  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const handleSubmitAlert = () => {
    disableAlertModal();
    leaveCommunityMutation
      .mutateAsync(community._id)
      .then(() => {
        setCommunities((prevCommunities) =>
          prevCommunities?.filter(
            (prevCommunity) => prevCommunity._id !== community._id,
          ),
        );

        if (params?.communityId === community._id) {
          navigate('/dms');
        }
        closeAlertModal();
      })
      .catch((error) => {
        defaultErrorHandler(error);
      })
      .finally(() => {
        enableAlertModal();
      });
  };

  const handleClickCommunityLeaveButton = () => {
    closeContextMenuModal();
    openAlertModal({
      description: `정말로 ${community.name} 커뮤니티에서 나가시겠습니까?`,
      onCancel: closeAlertModal,
      onSubmit: handleSubmitAlert,
    });
  };

  const handleClickUserInviteButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <CommunityInviteBox />,
      data: { communityId: community._id },
      overlayBackground: 'black',
      x: '50%',
      y: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    });
  };

  return (
    <section
      className="w-[300px] p-[16px]"
      onContextMenu={handleRightClickContextMenu}
    >
      <h3 className="sr-only">커뮤니티 컨텍스트 메뉴</h3>
      <ul className="">
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
          <button className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]">
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
