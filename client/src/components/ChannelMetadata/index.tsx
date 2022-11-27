import type { FC } from 'react';

import Avatar from '@components/Avatar';
import ChannelItem from '@components/ChannelItem';
import React from 'react';

const formatDate = (str: string) => {
  const d = new Date(str);

  return { year: d.getFullYear(), month: d.getMonth() + 1, date: d.getDate() };
};

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
  const { year, month, date } = formatDate(createdAt);

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
          <span className="font-bold">@{managerName}</span>님이 이 채널을 {year}
          년 {month}월 {date}일에 생성했습니다.
        </div>
      </div>
    </div>
  );
};

export default ChannelMetadata;
