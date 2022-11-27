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

interface SetCommunities {
  (
    callback: (
      communities?: GetCommunitiesResult,
    ) => GetCommunitiesResult | undefined,
  ): void;
  (communities: GetCommunitiesResult): void;
}

/**
 * ### 커뮤니티 쿼리 응답 데이터의 Setter를 반환하는 Custom Hook
 * - useState hook의 setState처럼 사용하면 됩니다.
 * ```tsx
 *   사용 예시
 *   setComms(
 *     (prevComms) => prevComms.filter(
 *       (prevComm) => prevComm.id !== id
 *     )
 *   )
 * ```
 */
export const useSetCommunitiesQuery = () => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.all();

  const setCommunities: SetCommunities = (cb) => {
    queryClient.setQueryData<GetCommunitiesResult>(key, (communities) => {
      if (typeof cb === 'function') return cb(communities);
      return cb;
    });
  };

  return setCommunities;
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
