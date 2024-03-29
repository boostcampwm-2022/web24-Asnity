import type { JoinedChannel } from '@apis/channel';
import type { MouseEventHandler } from 'react';

import ChannelContextMenu from '@components/ChannelContextMenu';
import ChannelCreateBox from '@components/ChannelCreateBox';
import ChannelItem from '@components/ChannelItem';
import ErrorMessage from '@components/ErrorMessage';
import Spinner from '@components/Spinner';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useCommunitiesMapQuery } from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import cn from 'classnames';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams, Link } from 'react-router-dom';

const CommunityNav = () => {
  const params = useParams() as { communityId: string; roomId?: string };
  const { communityId, roomId } = params;

  const communitiesMapQuery = useCommunitiesMapQuery();
  const communitySummary = communitiesMapQuery.data?.[communityId];
  const joinedChannels = communitySummary?.channels;
  const joinedChannelsLength = joinedChannels?.length || 0;

  const [visible, setVisible] = useState(true);
  const toggleVisible = () => setVisible((prevVisible) => !prevVisible);
  const rotateChevronIconClassnames = cn({ 'rotate-[-90deg]': !visible });

  const openContextMenuModal = useRootStore(
    (state) => state.openContextMenuModal,
  );
  const openCommonModal = useRootStore((state) => state.openCommonModal);

  const handleRightClickChannelItem =
    (channel: JoinedChannel): MouseEventHandler<HTMLLIElement> =>
    (e) => {
      const contextMenuHeight = 177;
      const top =
        e.clientY + contextMenuHeight > window.innerHeight
          ? e.clientY - contextMenuHeight
          : e.clientY;

      openContextMenuModal({
        content: <ChannelContextMenu channel={channel} />,
        contentWrapperStyle: {
          borderRadius: 16,
          left: e.clientX,
          top,
        },
      });
    };

  const handleClickChannelCreateButton = () => {
    openCommonModal({
      overlayBackground: 'black',
      content: <ChannelCreateBox communityId={communityId} />,
      contentWrapperStyle: {
        left: '50%',
        top: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
    });
  };

  return (
    <nav className="flex flex-col flex-1 h-full">
      <header className="flex shrink-0 items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          {!!communitySummary && (
            <Link to={`/communities/${communityId}`}>
              {communitySummary.name}
            </Link>
          )}
        </h2>
      </header>
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-between items-center py-[16px] px-[12px]">
          <div className="flex gap-[8px]">
            <button onClick={toggleVisible}>
              <span className="sr-only">
                {visible ? '채널 목록 접기' : '채널 목록 펼치기'}
              </span>
              <ChevronDownIcon
                className={`w-[20px] h-[20px] fill-titleActive transition-[transform] ${rotateChevronIconClassnames}`}
              />
            </button>
            <span className="text-s18 font-bold">
              참여중인 채널 ({joinedChannelsLength})
            </span>
          </div>
          <button onClick={handleClickChannelCreateButton}>
            <span className="sr-only">채널 생성</span>
            <PlusIcon className="w-5 h-5 fill-titleActive" />
          </button>
        </div>
        {communitiesMapQuery.isLoading ? (
          <Spinner
            className="flex justify-center items-center h-full"
            size={40}
          />
        ) : communitiesMapQuery.error ? (
          <ErrorMessage size="lg" className="flex justify-center items-center">
            채널 목록을 불러오는데
            <br /> 오류가 발생했습니다.
          </ErrorMessage>
        ) : (
          <Scrollbars>
            <ul className="flex flex-col">
              {joinedChannels?.map((channel) => {
                const itemClassnames = cn('flex items-center hover:shadow-sm', {
                  hidden: !visible && channel._id !== roomId,
                  'text-placeholder hover:bg-offWhite': channel._id !== roomId,
                  'bg-indigo text-offWhite hover:bg-indigo hover:text-offwhite shadow-xl':
                    channel._id === roomId,
                });

                return (
                  <ChannelItem
                    key={channel._id}
                    communityId={communityId}
                    channel={channel}
                    className={itemClassnames}
                    onContextMenu={handleRightClickChannelItem(channel)}
                  />
                );
              })}
            </ul>
          </Scrollbars>
        )}
      </div>
    </nav>
  );
};

export default CommunityNav;
