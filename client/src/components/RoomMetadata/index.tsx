import type { FC, ReactNode } from 'react';

import Avatar from '@components/Avatar';
import { LOGO_IMG_URL } from '@constants/url';
import React from 'react';

interface Props {
  profileUrl?: string;
  channelName: string;
  children?: ReactNode;
}

const RoomMetadata: FC<Props> = ({
  profileUrl = LOGO_IMG_URL,
  children,
  channelName,
}) => {
  return (
    <div className="flex min-w-max min-h-[55px] items-center gap-2">
      <div>
        <Avatar
          variant="rectangle"
          size="small"
          url={profileUrl}
          name={channelName}
        />
      </div>
      {children}
    </div>
  );
};

export default RoomMetadata;
