import type { FC } from 'react';

import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import React, { memo } from 'react';

interface Props {
  name: string;
  isPrivate?: boolean;
  className?: string;
}

const ChannelItem: FC<Props> = ({ name, isPrivate = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-[5px] select-none ${className}`}>
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
      <div className="text-s16 w-full">{name}</div>
    </div>
  );
};

export default memo(ChannelItem);
