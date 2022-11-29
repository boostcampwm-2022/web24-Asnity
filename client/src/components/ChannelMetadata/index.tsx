import type { FC } from 'react';

import ChannelName from '@components/ChannelName';
import RoomMetadata from '@components/RoomMetadata';
import { formatDate } from '@utils/date';
import React from 'react';

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
          <ChannelName
            isPrivate={isPrivate}
            name={channelName}
            className="flex items-center mr-[4px] font-bold"
          />
          의 시작이에요.
        </div>
        <div>
          <span className="font-bold">@{managerName}</span>님이 이 채널을{' '}
          {formatDate(createdAt)}에 생성했습니다.
        </div>
      </div>
    </RoomMetadata>
  );
};

export default ChannelMetadata;
