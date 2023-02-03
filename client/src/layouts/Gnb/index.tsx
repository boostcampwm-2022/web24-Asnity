import type { CommunitySummary } from '@apis/community';
import type { MouseEventHandler } from 'react';

import Avatar from '@components/Avatar';
import CommunityContextMenu from '@components/CommunityContextMenu';
import CommunityCreateBox from '@components/CommunityCreateBox';
import ErrorIcon from '@components/ErrorIcon';
import GnbItemContainer from '@components/GnbItemContainer';
import Spinner from '@components/Spinner';
import { LOGO_IMG_URL } from '@constants/url';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useCommunitiesQuery } from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import cn from 'classnames';
import React, { memo, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Link, useLocation, useParams } from 'react-router-dom';
import shallow from 'zustand/shallow';

const Gnb = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const { openContextMenuModal, openCommonModal } = useRootStore(
    (state) => ({
      openContextMenuModal: state.openContextMenuModal,
      openCommonModal: state.openCommonModal,
    }),
    shallow,
  );

  const communitiesQuery = useCommunitiesQuery();

  const communityItemPaddingBeforeLoading = cn({
    'pb-[30vh]': !communitiesQuery.isLoading,
  });

  const handleRightClickGnb: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
    },
    [],
  );

  const handleRightClickCommunityLink: (
    community: CommunitySummary,
  ) => MouseEventHandler<HTMLAnchorElement> = (community) => (e) => {
    e.preventDefault();

    // 컨텍스트 메뉴의 높이는 약 180px
    const contextMenuHeight = 177;
    const top =
      e.clientY + contextMenuHeight > window.innerHeight
        ? e.clientY - contextMenuHeight
        : e.clientY;

    openContextMenuModal({
      content: <CommunityContextMenu community={community} />,
      contentWrapperStyle: {
        left: e.clientX,
        top,
        borderRadius: 16,
      },
    });
  };

  const handleClickCreateCommunityButton = () => {
    openCommonModal({
      content: <CommunityCreateBox />,
      overlayBackground: 'black',
      contentWrapperStyle: {
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
    });
  };

  return (
    <div
      className="flex min-w-[80px] w-[80px] h-full bg-background border-r border-line z-[100px]"
      onContextMenu={handleRightClickGnb}
    >
      <div className="flex flex-col justify-start items-center w-full h-full pt-[16px]">
        <div className="w-full">
          <GnbItemContainer
            isActive={pathname === '/friends'}
            tooltip="Friends"
          >
            <Link to="/friends">
              <Avatar
                name="Asnity"
                size="sm"
                profileUrl={LOGO_IMG_URL}
                variant="rectangle"
              />
            </Link>
          </GnbItemContainer>
        </div>

        <div className="w-[70%] h-[2px] bg-line mb-[10px] shrink-0" />

        <Scrollbars autoHide autoHideTimeout={200}>
          <ul
            className={`inline-flex flex-col w-full h-auto shrink-0 mb-10 min-h-full ${communityItemPaddingBeforeLoading}`}
          >
            {communitiesQuery.isLoading ? (
              <Spinner
                className="flex grow justify-center items-center h-full"
                size={40}
              />
            ) : communitiesQuery.error ? (
              <ErrorIcon description="커뮤니티 데이터를 불러오는데 오류가 발생했습니다." />
            ) : (
              communitiesQuery.data?.map((community) => {
                const { _id, name, profileUrl } = community;
                const existUnreadChat = community.channels.some(
                  (channel) => channel.existUnreadChat,
                );

                return (
                  <li key={_id}>
                    <GnbItemContainer
                      isActive={params?.communityId === _id}
                      tooltip={name}
                    >
                      <Link
                        to={`/communities/${_id}`}
                        onContextMenu={handleRightClickCommunityLink(community)}
                      >
                        <Avatar
                          name={name}
                          size="sm"
                          variant="rectangle"
                          profileUrl={profileUrl}
                          badge={existUnreadChat}
                          badgePosition="top-left"
                          status="NEW"
                        />
                      </Link>
                    </GnbItemContainer>
                  </li>
                );
              })
            )}
            {communitiesQuery.data && (
              <button
                className="flex shrink-0 justify-center w-full"
                type="button"
                onClick={handleClickCreateCommunityButton}
              >
                <span className="sr-only">커뮤니티 추가</span>
                <Avatar
                  name="커뮤니티 추가"
                  size="sm"
                  variant="circle"
                  className="transition-all mx-auto hover:bg-primary hover:border-primary hover:text-offWhite"
                >
                  <PlusIcon className="w-6 h-6" />
                </Avatar>
              </button>
            )}
          </ul>
        </Scrollbars>
      </div>
    </div>
  );
};

export default memo(Gnb);
