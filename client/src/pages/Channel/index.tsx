import ChannelMetadata from '@components/ChannelMetadata';
import { useChannelQuery } from '@hooks/channel';
import { useUserQuery } from '@hooks/user';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { roomId } = useParams();
  const { channelQuery } = useChannelQuery(roomId as string);
  const { userQuery } = useUserQuery(channelQuery.data?.managerId as string, {
    enabled: !!channelQuery.data?.managerId,
  });

  if (channelQuery.isLoading) return <div>loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex items-center pl-[55px] w-full h-header border-b border-line text-indigo font-bold text-[24px]">
        <div className="block w-[400px] overflow-ellipsis overflow-hidden whitespace-nowrap">
          {channelQuery.data && `#${channelQuery.data.name}`}
        </div>
      </header>
      <div className="flex h-full">
        <div className="flex-1 min-w-[720px] max-w-[960px] h-full">
          <Scrollbars>
            {channelQuery.data && userQuery.data && (
              <div className="p-8">
                <ChannelMetadata
                  profileUrl={channelQuery.data.profileUrl}
                  channelName={channelQuery.data.name}
                  isPrivate={channelQuery.data.isPrivate}
                  createdAt={channelQuery.data.createdAt}
                  managerName={userQuery.data.nickname}
                />
              </div>
            )}
            <div>채팅목록 렌더링</div>
          </Scrollbars>
        </div>
        <div className="flex w-72 h-full border-l border-line">
          온라인, 오프라인
        </div>
      </div>
    </div>
  );
};

export default Channel;
