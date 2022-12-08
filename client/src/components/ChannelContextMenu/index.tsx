import type { JoinedChannel } from '@apis/channel';
import type { FC } from 'react';

import ChannelInviteBox from '@components/ChannelInviteBox';
import ChannelLeaveBox from '@components/ChannelLeaveBox';
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid';
import { useRootStore } from '@stores/rootStore';
import React from 'react';

export interface Props {
  channel: JoinedChannel;
}

const ChannelContextMenu: FC<Props> = ({ channel }) => {
  const openCommonModal = useRootStore((state) => state.openCommonModal);
  const closeContextMenuModal = useRootStore(
    (state) => state.closeContextMenuModal,
  );

  const handleClickChannelInviteButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <ChannelInviteBox channelId={channel._id} />,
      overlayBackground: 'black',
      x: '50%',
      y: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    });
  };

  const handleClickChannelSettingsButton = () => { };

  const handleClickChannelLeaveButton = () => {
    closeContextMenuModal();
    openCommonModal({
      content: <ChannelLeaveBox channel={channel} />,
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
      <h3 className="sr-only">채널 컨텍스트 메뉴</h3>
      <ul>
        {channel.isPrivate && (
          <li className="mb-[8px]">
            <button
              className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
              onClick={handleClickChannelInviteButton}
            >
              <span>채널에 초대하기</span>
              <UserPlusIcon className="w-6 h-6 pointer-events-none text-placeholder" />
            </button>
          </li>
        )}
        <li className="mb-[8px]">
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
            onClick={handleClickChannelSettingsButton}
          >
            <span>채널 설정하기</span>
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
          onClick={handleClickChannelLeaveButton}
        >
          <span>채널에서 나가기</span>
          <ArrowRightOnRectangleIcon className="w-6 h-6 pointer-events-none text-error" />
        </button>
      </div>
    </section>
  );
};

export default ChannelContextMenu;
