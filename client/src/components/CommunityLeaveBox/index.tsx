import type { CommunitySummary } from '@apis/community';
import type { FC } from 'react';

import AlertBox from '@components/AlertBox';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import {
  useLeaveCommunityMutation,
  useSetCommunitiesQuery,
} from '@hooks/community';
import { useRootStore } from '@stores/rootStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  community: CommunitySummary;
}

const CommunityLeaveBox: FC<Props> = ({ community }) => {
  const params = useParams();
  const navigate = useNavigate();
  const setCommunities = useSetCommunitiesQuery();
  const closeCommonModal = useRootStore((state) => state.closeCommonModal);

  const leaveCommunityMutation = useLeaveCommunityMutation({
    onSuccess: () => {
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
