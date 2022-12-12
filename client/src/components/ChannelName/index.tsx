import type { FC, ComponentPropsWithoutRef } from 'react';

import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import React, { memo } from 'react';

export interface Props extends ComponentPropsWithoutRef<'div'> {
  isPrivate: boolean;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const nameClassnames = {
  sm: 'text-s16',
  md: 'text-s18',
  lg: 'text-s20',
};

const iconClassnames = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

const ChannelName: FC<Props> = ({
  isPrivate,
  name,
  size = 'sm',
  ...restProps
}) => {
  return (
    <div {...restProps}>
      {isPrivate ? (
        <div>
          <span className="sr-only">비공개 채널</span>
          <LockClosedIcon className={iconClassnames[size]} />
        </div>
      ) : (
        <div>
          <span className="sr-only">공개 채널</span>
          <HashtagIcon className={iconClassnames[size]} />
        </div>
      )}
      <div className={`${nameClassnames[size]} w-full`}>{name}</div>
    </div>
  );
};

export default memo(ChannelName);
