import type { CommunitySummary } from '@apis/community';
import type { MouseEventHandler, FC } from 'react';

import AlertBox from '@components/AlertBox';
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

  const setCommunities = useSetCommunitiesQuery();

  useCommunityUsersQuery(community._id);

  const openCommonModal = useRootStore((state) => state.openCommonModal);
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const leaveCommunityMutation = useLeaveCommunityMutation({
    onSuccess: () => {
      setCommunities((prevCommunities) =>
        prevCommunities?.filter(
          (prevCommunity) => prevCommunity._id !== community._id,
        ),
      );

      if (params?.communityId === community._id) {
        navigate('/dms');
      }
      closeCommonModal();
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const handleSubmitAlert = () => {
    leaveCommunityMutation.mutate(community._id);
  };

  const handleClickCommunityLeaveButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: (
        <AlertBox
          description={`정말로 ${community.name}커뮤니티에서 나가시겠습니까?`}
          onCancel={closeCommonModal}
          onSubmit={handleSubmitAlert}
          disabled={leaveCommunityMutation.isLoading}
        />
      ),
      overlayBackground: 'black',
      x: '50%',
      y: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    });
  };

  const handleClickUserInviteButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <CommunityInviteBox communityId={community._id} />,
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
