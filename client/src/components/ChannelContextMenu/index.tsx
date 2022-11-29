import type { FC } from 'react';

import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserPlusIcon,
} from '@heroicons/react/20/solid';
import React from 'react';

export interface Props {}

const ChannelContextMenu: FC<Props> = () => {
  const handleClickChannelInviteButton = () => {};

  const handleClickChannelSettingsButton = () => {};

  const handleClickChannelLeaveButton = () => {};

  return (
    <section className="w-[300px] p-[16px]">
      <h3 className="sr-only">채널 컨텍스트 메뉴</h3>
      <ul>
        <li className="mb-[8px]">
          <button
            className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]"
            onClick={handleClickChannelInviteButton}
          >
            <span>채널에 초대하기</span>
            <UserPlusIcon className="w-6 h-6 pointer-events-none text-placeholder" />
          </button>
        </li>
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
