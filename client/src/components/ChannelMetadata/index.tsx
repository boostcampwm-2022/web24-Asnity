import type { FC } from 'react';

import Avatar from '@components/Avatar';
import ChannelItem from '@components/ChannelItem';
import { formatDate } from '@utils/date';
import React from 'react';

interface Props {
  profileUrl: string;
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
    <div className="flex min-w-max min-h-[55px] items-center gap-2">
      <div>
        <Avatar
          variant="rectangle"
          size="small"
          url={profileUrl}
          name={channelName}
        />
      </div>
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
          {formatDate(createdAt)}에 생성했습니다.
        </div>
      </div>
    </div>
  );
};

export default ChannelMetadata;
