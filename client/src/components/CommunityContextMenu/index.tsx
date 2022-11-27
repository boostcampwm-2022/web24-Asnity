import type { MouseEventHandler } from 'react';

import {
  UserPlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid';
import React, { useCallback } from 'react';

interface Props {}

const CommunityContextMenu: React.FC<Props> = () => {
  const handleRightClickContextMenu: MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      e.preventDefault();
    }, []);

  return (
    <section
      className="w-[300px] p-[16px]"
      onContextMenu={handleRightClickContextMenu}
    >
      <h3 className="sr-only">커뮤니티 컨텍스트 메뉴</h3>
      <ul className="">
        <li className="mb-[8px]">
          <button className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]">
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
      <div>
        <button className="flex justify-between items-center w-full text-s16 h-[40px] rounded-xl hover:bg-background px-[12px]">
          <span>커뮤니티에서 나가기</span>
          <ArrowRightOnRectangleIcon className="w-6 h-6 pointer-events-none text-error" />
        </button>
      </div>
    </section>
  );
};

export default CommunityContextMenu;
