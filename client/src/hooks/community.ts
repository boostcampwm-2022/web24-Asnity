import type { SuccessResponse } from '@@types/apis/response';
import type {
  CreateCommunityResult,
  CreateCommunityRequest,
  GetCommunitiesResult,
} from '@apis/community';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { createCommunity, getCommunities } from '@apis/community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import queryKeyCreator from 'src/queryKeyCreator';

export const useCommunitiesQuery = () => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.all();
  const query = useQuery<GetCommunitiesResult, AxiosError>(key, getCommunities);
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries(key);
  }, [queryClient, key]);

  return { communitiesQuery: query, invalidateCommunitiesQuery: invalidate };
};

export const useCreateCommunityMutation = (
  options: UseMutationOptions<
    SuccessResponse<CreateCommunityResult>,
    unknown,
    CreateCommunityRequest
  >,
) => {
  const key = queryKeyCreator.community.createCommunity();
  const mutation = useMutation(key, createCommunity, { ...options });

  return mutation;
};
