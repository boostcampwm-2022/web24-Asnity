import ChannelItem from '@components/ChannelItem';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useCommunitiesQuery, useJoinedChannelsQuery } from '@hooks/community';
import cn from 'classnames';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CommunityNav = () => {
  const params = useParams() as { communityId: string };
  const { communityId } = params;
  const { communitiesQuery } = useCommunitiesQuery();
  const communitySummary = communitiesQuery.data?.find(
    ({ _id }) => _id === communityId,
  );
  const { joinedChannelsQuery } = useJoinedChannelsQuery(communityId);

  const { roomId } = useParams();
  const [visible, setVisible] = useState(true);

  const toggleVisible = () => setVisible((prevVisible) => !prevVisible);
  const rotateChevronIconClassnames = cn({ 'rotate-[-90deg]': !visible });

  return (
    <nav className="flex flex-col flex-1">
      <header className="flex items-center px-[22px] w-full h-header border-b border-line font-ipSans text-title select-none tracking-tighter">
        <h2>
          <Link to={`/communities/${communityId}`}>
            {communitySummary?.name}
          </Link>
        </h2>
      </header>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center py-[16px] px-[12px]">
          <div className="flex gap-[8px]">
            <button onClick={toggleVisible}>
              <span className="sr-only">
                {visible ? '채널 목록 접기' : '채널 목록 펼치기'}{' '}
              </span>
              <ChevronDownIcon
                className={`w-[20px] h-[20px] fill-titleActive transition-[transform] ${rotateChevronIconClassnames}`}
              />
            </button>
            <span className="text-s18 font-bold">참여중인 채널</span>
          </div>
          <button>
            <span className="sr-only">채널 생성</span>
            <PlusIcon className="w-5 h-5 fill-titleActive" />
          </button>
        </div>
        {joinedChannelsQuery.isLoading ? (
          <div>loading...</div>
        ) : (
          <ul className="flex flex-col">
            {joinedChannelsQuery.data?.map((channel) => (
              <li
                key={channel._id}
                className={cn('flex items-center', {
                  hidden: !visible && channel._id !== roomId,
                  'text-placeholder hover:bg-offWhite': channel._id !== roomId,
                  'bg-indigo text-offWhite hover:bg-indigo hover:text-offwhite':
                    channel._id === roomId,
                })}
              >
                <Link
                  to={`/communities/${communityId}/channels/${channel._id}`}
                  className="w-full py-[6px] pl-[40px]"
                >
                  <ChannelItem
                    className="w-full"
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
