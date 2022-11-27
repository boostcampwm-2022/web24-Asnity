import Avatar from '@components/Avatar';
import ChannelMetadata from '@components/ChannelMetadata';
import { useChannelQuery } from '@hooks/channel';
import { useCommunityQuery } from '@hooks/community';
import { useUserQuery } from '@hooks/user';
import React from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { communityId, roomId } = useParams();
  const { communityQuery } = useCommunityQuery(communityId as string);
  const { channelQuery } = useChannelQuery(roomId as string);
  const { userQuery } = useUserQuery(channelQuery.data?.managerId as string, {
    enabled: !!channelQuery.data?.managerId,
  });

  if (channelQuery.isLoading || communityQuery.isLoading)
    return <div>loading...</div>;

  return (
    <div>
      {channelQuery.data && userQuery.data && communityQuery.data && (
        <ChannelMetadata
          profileUrl={communityQuery.data.profileUrl}
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
