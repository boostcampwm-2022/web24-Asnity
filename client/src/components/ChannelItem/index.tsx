import type { ComponentPropsWithoutRef } from 'react';

import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface Props extends ComponentPropsWithoutRef<'li'> {
  isPrivate?: boolean;
  name: string;
}
const ChannelItem: React.FC<Props> = ({ isPrivate = true, name }) => {
  return (
    <li className="flex items-center gap-[5px] pl-[40px] h-[45px] select-none">
      <div>
        {isPrivate ? (
          <>
            <span className="sr-only">비공개 채널</span>
            <LockClosedIcon className="w-5 h-5" />
          </>
        ) : (
          <>
            <span className="sr-only">공개 채널</span>
            <HashtagIcon className="w-5 h-5" />
          </>
        )}
      </div>
      <div className="text-s18">{name}</div>
    </li>
  );
};

export default ChannelItem;
