import type { FC, ComponentPropsWithoutRef } from 'react';

import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import React, { memo } from 'react';

export interface Props extends ComponentPropsWithoutRef<'div'> {
  isPrivate: boolean;
  name: string;
}

const ChannelName: FC<Props> = ({ isPrivate, name, ...restProps }) => {
  return (
    <div {...restProps}>
      {isPrivate ? (
        <div>
          <span className="sr-only">비공개 채널</span>
          <LockClosedIcon className="w-5 h-5" />
        </div>
      ) : (
        <div>
          <span className="sr-only">공개 채널</span>
          <HashtagIcon className="w-5 h-5" />
        </div>
      )}
      <div className="text-s16 w-full">{name}</div>
    </div>
  );
};

export default memo(ChannelName);
