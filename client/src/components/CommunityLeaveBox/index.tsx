import type { CommunitySummary } from '@apis/community';
import type { FC } from 'react';

import AlertBox from '@components/AlertBox';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import {
  useLeaveCommunityMutation,
  useSetCommunitiesQueryData,
} from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import { useSocketStore } from '@stores/socketStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  community: CommunitySummary;
}

const CommunityLeaveBox: FC<Props> = ({ community }) => {
  const params = useParams();
  const navigate = useNavigate();
  const setCommunities = useSetCommunitiesQueryData();
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);
  const socket = useSocketStore((state) => state.sockets[community._id]);

  const leaveCommunityMutation = useLeaveCommunityMutation({
    onSuccess: () => {
      socket.leaveCommunity();
      socket.disconnect();

      setCommunities((prevCommunities) =>
        prevCommunities?.filter(
          (prevCommunity) => prevCommunity._id !== community._id,
        ),
      );

      if (params?.communityId === community._id) {
        navigate('/dms');
      }
      closeCommonModal();
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const handleSubmitAlert = () => {
    leaveCommunityMutation.mutate(community._id);
  };

  return (
    <div>
      <AlertBox
        description={`정말로 ${community.name}커뮤니티에서 나가시겠습니까?`}
        onCancel={closeCommonModal}
        onSubmit={handleSubmitAlert}
        disabled={leaveCommunityMutation.isLoading}
      />
    </div>
  );
};

export default CommunityLeaveBox;
