import ChannelItem from '@components/ChannelItem';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { useChannelsQuery } from '@hooks/channel';
import { useCommunitiesQuery } from '@hooks/community';
import cn from 'classnames';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CommunityNav = () => {
  const { communityId } = useParams();
  const { communitiesQuery } = useCommunitiesQuery();
  const communitySummary = communitiesQuery.data?.find(
    ({ _id }) => _id === communityId,
  );

  const { roomId } = useParams();
  const { channelsQuery } = useChannelsQuery(communityId as string);
  const [visible, setVisible] = useState(true);

  const handleVisible = () => setVisible(!visible);

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none">
        {communitySummary?.name}
      </header>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center py-[16px] px-[12px]">
          <div className="flex gap-[8px]">
            <button onClick={handleVisible}>
              {visible ? (
                <>
                  <span className="sr-only">채널 목록 접기</span>
                  <ChevronDownIcon className="w-[20px] h-[20px] fill-titleActive" />
                </>
              ) : (
                <>
                  <span className="sr-only">채널 목록 펼치기</span>
                  <ChevronRightIcon className="w-[20px] h-[20px] fill-titleActive" />
                </>
              )}
            </button>
            <span className="text-s18 font-bold">참여중인 채널</span>
          </div>
          <button>
            <span className="sr-only">채널 생성</span>
            <PlusIcon className="w-5 h-5 fill-titleActive" />
          </button>
        </div>
        {channelsQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          <ul className="flex flex-col">
            {channelsQuery.data?.map((channel) => (
              <li
                key={channel.id}
                className={cn('flex items-center py-[6px] pl-[40px]', {
                  hidden: !visible && channel.id !== roomId,
                  'text-placeholder hover:bg-offWhite': channel.id !== roomId,
                  'bg-indigo text-offWhite hover:bg-indigo hover:text-offwhite':
                    channel.id === roomId,
                })}
              >
                <Link to={`/communities/${communityId}/channels/${channel.id}`}>
                  <ChannelItem
                    name={channel.name}
                    isPrivate={channel.isPrivate}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default CommunityNav;
