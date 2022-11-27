import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface Props {
  isPrivate?: boolean;
  name: string;
  className?: string;
}

const ChannelItem: React.FC<Props> = ({
  isPrivate = true,
  name,
  className,
}) => {
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
      <div className="text-s18">{name}</div>
    </div>
  );
};

export default ChannelItem;