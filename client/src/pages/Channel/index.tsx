import ChannelMetadata from '@components/ChannelMetadata';
import { useChannelQuery } from '@hooks/channel';
import { useUserQuery } from '@hooks/user';
import React from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { roomId } = useParams();
  const { channelQuery } = useChannelQuery(roomId as string);
  const { userQuery } = useUserQuery(channelQuery.data?.managerId as string, {
    enabled: !!channelQuery.data?.managerId,
  });

  if (channelQuery.isLoading) return <div>loading...</div>;

  return (
    <div>
      {channelQuery.data && userQuery.data && (
        <ChannelMetadata
          profileUrl={channelQuery.data.profileUrl}
          channelName={channelQuery.data.name}
          isPrivate={channelQuery.data.isPrivate}
          createdAt={channelQuery.data.createdAt}
          managerName={userQuery.data.nickname}
        />
      )}
    </div>
  );
};

export default Channel;
