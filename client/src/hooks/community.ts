import type {
  CreateCommunityResult,
  CreateCommunityRequest,
  GetCommunitiesResult,
  GetCommunityResult,
  RemoveCommunityResult,
  LeaveCommunityResult,
} from '@apis/community';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createCommunity,
  getCommunities,
  leaveCommunity,
  removeCommunity,
  getCommunity,
} from '@apis/community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import queryKeyCreator from 'src/queryKeyCreator';

export const useCommunitiesQuery = () => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.all();
  const query = useQuery<GetCommunitiesResult, AxiosError>(key, getCommunities);
  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries(key);
  }, [queryClient, key]);

  return { communitiesQuery: query, invalidateCommunitiesQuery: invalidate };
};

export const useCommunityQuery = (communityId: string) => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.detail(communityId);
  const query = useQuery<GetCommunityResult, AxiosError>(key, () =>
    getCommunity(communityId),
  );
  const invalidate = useCallback(
    () => queryClient.invalidateQueries(key),
    [queryClient, key],
  );

  return { communityQuery: query, invalidateCommunityQuery: invalidate };
};

export const useCreateCommunityMutation = (
  options: UseMutationOptions<
    CreateCommunityResult,
    unknown,
    CreateCommunityRequest
  >,
) => {
  const key = queryKeyCreator.community.createCommunity();
  const mutation = useMutation(key, createCommunity, { ...options });

  return mutation;
};

export const useRemoveCommunityMutation = (
  options?: UseMutationOptions<RemoveCommunityResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.community.removeCommunity();
  const mutation = useMutation(key, removeCommunity, { ...options });

  return mutation;
};

export const useLeaveCommunityMutation = (
  options?: UseMutationOptions<LeaveCommunityResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.community.leaveCommunity();
  const mutation = useMutation(key, leaveCommunity, { ...options });

  return mutation;
};
