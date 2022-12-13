import ChannelCard from '@components/ChannelCard';
import ErrorIcon from '@components/ErrorIcon';
import ErrorMessage from '@components/ErrorMessage';
import Spinner from '@components/Spinner';
import { useCommunitiesMapQuery } from '@hooks/community';
import { useCommunityUsersMapQuery } from '@hooks/user';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useParams } from 'react-router-dom';

const ChannelInfoLayer = () => {
  const { communityId } = useParams() as { communityId: string };
  const communitiesMapQuery = useCommunitiesMapQuery();
  const communitySummary = communitiesMapQuery.data?.[communityId];
  const communityUsersMapQuery = useCommunityUsersMapQuery(communityId);

  const isLoading = !communitySummary || communityUsersMapQuery.isLoading;
  const isError = communityUsersMapQuery.isError;

  if (isError) {
    return (
      <div className="flex flex-col w-full h-full flex justify-center items-center">
        <ErrorIcon />
        <ErrorMessage size="lg">
          사용자 정보를 불러오는 중에 오류가 발생했습니다.
        </ErrorMessage>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
        채널 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <Scrollbars>
        <ol className="flex flex-col justify-center gap-8">
          {communitySummary.channels.map((channel) => {
            const manager =
              process.env.NODE_ENV === 'development'
                ? Object.values(communityUsersMapQuery.data)[0]
                : communityUsersMapQuery.data[channel.managerId];

            return (
              <ChannelCard
                key={channel._id}
                channel={channel}
                manager={manager}
              />
            );
          })}
        </ol>
      </Scrollbars>
    </div>
  );
};

export default ChannelInfoLayer;
