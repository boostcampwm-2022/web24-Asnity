import type { JoinedChannel } from '@apis/channel';
import type { FC } from 'react';

import AlertBox from '@components/AlertBox';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import {
  useLeaveChannelMutation,
  useSetChannelQueryData,
} from '@hooks/channel';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  channel: JoinedChannel;
}
const ChannelLeaveBox: FC<Props> = ({ channel }) => {
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId as string;
  const communityId = params.communityId as string;

  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const { deleteChannelQueryData } = useSetChannelQueryData();
  const leaveChannelMutation = useLeaveChannelMutation({
    onSuccess: () => {
      console.log(communityId, channel._id);
      deleteChannelQueryData(communityId, channel._id);

      if (roomId === channel._id) navigate(`/communities/${communityId}`);
      closeCommonModal();
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const handleSubmitAlert = () => {
    leaveChannelMutation.mutate(channel._id);
  };

  return (
    <AlertBox
      onSubmit={handleSubmitAlert}
      onCancel={closeCommonModal}
      description={`정말로 ${channel.name} 채널을 나가시겠습니까?`}
      disabled={leaveChannelMutation.isLoading}
    />
  );
};

export default ChannelLeaveBox;
