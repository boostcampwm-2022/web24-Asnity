import type { CommunitySummary } from '@apis/community';
import type { MouseEventHandler } from 'react';

import Avatar from '@components/Avatar';
import Badge from '@components/Badge';
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

const Gnb = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const openContextMenuModal = useRootStore(
    (state) => state.openContextMenuModal,
  );

  const openCommonModal = useRootStore((state) => state.openCommonModal);

  const { communitiesQuery } = useCommunitiesQuery();

  const communityItemListPadding = cn({
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

    openContextMenuModal({
      content: <CommunityContextMenu community={community} />,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleClickCreateCommunityButton = () => {
    openCommonModal({
      content: <CommunityCreateBox />,
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
      <div className="flex flex-col justify-start items-center w-full h-full pt-[16px]">
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

        <div className="w-[70%] h-[2px] bg-line mb-[10px] shrink-0" />

        <Scrollbars autoHide autoHideTimeout={200}>
          <ul
            className={`inline-flex flex-col w-full h-auto shrink-0 mb-10 min-h-full ${communityItemListPadding}`}
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

                return (
                  <li key={_id}>
                    <GnbItemContainer isActive={params?.communityId === _id}>
                      <Link
                        to={`/communities/${_id}`}
                        onContextMenu={handleRightClickCommunityLink(community)}
                      >
                        {community.channels.some(
                          (channel) => channel.lastRead,
                        ) ? (
                          <Badge
                            vertical="top"
                            horizontal="left"
                            color="primary"
                          >
                            <Avatar
                              name={name}
                              size="small"
                              variant="rectangle"
                              url={profileUrl}
                            />
                          </Badge>
                        ) : (
                          <Avatar
                            name={name}
                            size="small"
                            variant="rectangle"
                            url={profileUrl}
                          />
                        )}
                      </Link>
                    </GnbItemContainer>
                  </li>
                );
              })
            )}
            {communitiesQuery.data && (
              <button
                className="shrink-0 justify-center w-full"
                type="button"
                onClick={handleClickCreateCommunityButton}
              >
                <span className="sr-only">커뮤니티 추가</span>
                <Avatar
                  name="커뮤니티 추가"
                  size="small"
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

      {/* TODO: 툴팁 만들기 */}
      {/* <div className="absolute p-[12px] w-max h-max bg-titleActive text-offWhite left-[100px] top-[20px] z-[9000px]">*/}
      {/* </div>*/}
    </div>
  );
};

export default memo(Gnb);
