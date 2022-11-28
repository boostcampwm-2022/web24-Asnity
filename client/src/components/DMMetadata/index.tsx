import type { FC } from 'react';

import ChannelItem from '@components/ChannelItem';
import RoomMetadata from '@components/RoomMetadata';
import { formatDate } from '@utils/date';
import React from 'react';

interface Props {
  friendProfileUrl?: string;
  channelName: string;
  isPrivate: boolean;
  createdAt: string;
  friendName: string;
  creatorName: string;
}

const DMMetadata: FC<Props> = ({
  friendProfileUrl,
  friendName,
  creatorName,
  createdAt,
}) => {
  return (
    <RoomMetadata profileUrl={friendProfileUrl} channelName={'Direct Message'}>
      <div className="flex flex-col justify-center h-full bg-primary">
        <div className="flex items-center">
          <span className="font-bold">@{friendName}</span>님과 나눈 다이렉트
          메시지의 첫 부분이에요.
        </div>
        <div>
          <span className="font-bold">@{creatorName}</span>님이 이 채널을{' '}
          {formatDate(createdAt)}에 생성했습니다.
        </div>
      </div>
    </RoomMetadata>
  );
};

export default DMMetadata;
