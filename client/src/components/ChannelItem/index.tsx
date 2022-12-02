import type { JoinedChannel } from '@apis/channel';
import type { ComponentPropsWithoutRef, FC } from 'react';

import ChannelName from '@components/ChannelName';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

export interface Props extends ComponentPropsWithoutRef<'li'> {
  communityId: string;
  channel: JoinedChannel;
}

const ChannelItem: FC<Props> = ({ channel, communityId, ...restProps }) => {
  return (
    <li {...restProps}>
      <Link
        to={`/communities/${communityId}/channels/${channel._id}`}
        className="w-full py-[6px] pl-[40px]"
      >
        <ChannelName
          isPrivate={channel.isPrivate}
          name={channel.name}
          className="flex items-center gap-[5px] select-none w-full"
        />
      </Link>
    </li>
  );
};

export default memo(ChannelItem);
