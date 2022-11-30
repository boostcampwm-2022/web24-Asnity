import type { FC } from 'react';

import ChannelItem from '@components/ChannelItem';
import RoomMetadata from '@components/RoomMetadata';
import { dateStringToKRLocaleDateString } from '@utils/date';
import React, { memo } from 'react';

interface Props {
  profileUrl?: string;
  channelName: string;
  isPrivate: boolean;
  createdAt: string;
  managerName: string;
}

const ChannelMetadata: FC<Props> = ({
  profileUrl,
  managerName,
  channelName,
  isPrivate,
  createdAt,
}) => {
  return (
    <RoomMetadata profileUrl={profileUrl} channelName={channelName}>
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center">
          <ChannelItem
            name={channelName}
            isPrivate={isPrivate}
            className="font-bold"
          />
          의 시작이에요.
        </div>
        <div>
          <span className="font-bold">@{managerName}</span>님이 이 채널을{' '}
          {dateStringToKRLocaleDateString(createdAt)}에 생성했습니다.
        </div>
      </div>
    </RoomMetadata>
  );
};

export default memo(ChannelMetadata);
