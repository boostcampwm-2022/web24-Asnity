import type { CommunitySummary } from '@apis/community';
import type { MouseEventHandler } from 'react';

import Avatar from '@components/Avatar';
import CreateCommunityBox from '@components/CreateCommunityBox';
import GnbItemContainer from '@components/GnbItemContainer';
import { LOGO_IMG_URL } from '@constants/url';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useCommunitiesQuery } from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import React, { memo, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Gnb = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const openContextMenuModal = useRootStore(
    (state) => state.openContextMenuModal,
  );

  const openCommonModal = useRootStore((state) => state.openCommonModal);

  const { communitiesQuery } = useCommunitiesQuery();

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

    openContextMenuModal({
      x: e.clientX,
      y: e.clientY,
      type: 'community',
      data: community,
    });
  };

  const handleClickCreateCommunityButton = () => {
    openCommonModal({
      content: <CreateCommunityBox />,
      overlayBackground: 'black',
      x: '50%',
      y: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    });
  };

  return (
    <div
      className="flex min-w-[80px] w-[80px] h-full bg-background border-r border-line z-[100px]"
      onContextMenu={handleRightClickGnb}
    >
      <div className="flex flex-col justify-start items-center w-full pt-[16px] overflow-auto no-display-scrollbar pb-[30vh]">
        <div className="w-full">
          <GnbItemContainer isActive={pathname === '/dms'}>
            <Link to="/dms">
              <Avatar
                name="Direct Message"
                size="small"
                url={LOGO_IMG_URL}
                variant="rectangle"
              />
            </Link>
          </GnbItemContainer>
        </div>

        <div className="w-[70%] h-[2px] bg-line mb-[10px]" />

        <ul className="w-full">
          {communitiesQuery.isLoading ? (
            <div>로딩중</div>
          ) : (
            communitiesQuery.data?.map((community) => {
              const { _id, name, profileUrl } = community;

              return (
                <li key={_id}>
                  <GnbItemContainer isActive={params?.communityId === _id}>
                    <Link
                      to={`/communities/${_id}`}
                      onContextMenu={handleRightClickCommunityLink(community)}
                    >
                      <Avatar
                        name={name}
                        size="small"
                        variant="rectangle"
                        url={profileUrl}
                      />
                    </Link>
                  </GnbItemContainer>
                </li>
              );
            })
          )}
        </ul>

        <button type="button" onClick={handleClickCreateCommunityButton}>
          <span className="sr-only">커뮤니티 추가</span>
          <Avatar
            name="커뮤니티 추가"
            size="small"
            variant="circle"
            className="transition-all hover:bg-primary hover:border-primary hover:text-offWhite"
          >
            <PlusIcon className="w-6 h-6" />
          </Avatar>
        </button>
      </div>

      {/* TODO: 툴팁 만들기 */}
      {/* <div className="absolute p-[12px] w-max h-max bg-titleActive text-offWhite left-[100px] top-[20px] z-[9000px]">*/}
      {/* </div>*/}
    </div>
  );
};

export default memo(Gnb);
