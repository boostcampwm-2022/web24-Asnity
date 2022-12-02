import type { Channel } from '@apis/channel';
import type { FC } from 'react';

import ChannelName from '@components/ChannelName';
import RoomMetadata from '@components/RoomMetadata';
import { dateStringToKRLocaleDateString } from '@utils/date';
import React, { memo } from 'react';

interface Props {
  channel: Channel;
  managerName?: string;
}

const ChannelMetadata: FC<Props> = ({
  channel,
  managerName = '(알수없음)',
}) => {
  const { profileUrl, name: channelName, isPrivate, createdAt } = channel;

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
          {dateStringToKRLocaleDateString(createdAt)}에 생성했습니다.
        </div>
      </div>
    </RoomMetadata>
  );
};

export default memo(ChannelMetadata);
