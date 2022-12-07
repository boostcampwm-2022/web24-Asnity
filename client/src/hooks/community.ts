import type { JoinedChannel } from '@apis/channel';
import type {
  CreateCommunityResult,
  CreateCommunityRequest,
  RemoveCommunityResult,
  LeaveCommunityResult,
  InviteCommunityResult,
  CommunitySummaries,
  CommunitySummary,
} from '@apis/community';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  inviteCommunity,
  createCommunity,
  getCommunities,
  leaveCommunity,
  removeCommunity,
} from '@apis/community';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import queryKeyCreator from 'src/queryKeyCreator';

export type CommunitiesMap = Record<CommunitySummary['_id'], CommunitySummary>;
/**
 *
 * @returns 쿼리 클라이언트에 캐싱된 커뮤니티 목록을 `Record<CommunitySummary['_id'], CommunitySummary>` 형태로 반환한다.
 */
export const useCommunitiesMapQueryData = (): CommunitiesMap | undefined => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.all();
  const communitiesQueryData =
    queryClient.getQueryData<CommunitySummaries>(key);

  return communitiesQueryData?.reduce(
    (acc, community) => ({
      ...acc,
      [community._id]: community,
    }),
    {},
  );
};

export const useCommunitiesMapQuery = () => {
  const key = queryKeyCreator.community.all();
  const query = useQuery<CommunitySummaries, AxiosError, CommunitiesMap>(
    key,
    getCommunities,
    {
      select: (communities) =>
        communities.reduce((acc, cur) => ({ ...acc, [cur._id]: cur }), {}),
    },
  );

  return query;
};

export const useCommunitiesQuery = () => {
  const queryClient = useQueryClient();

  const key = queryKeyCreator.community.all();
  const query = useQuery<CommunitySummaries, AxiosError>(key, getCommunities);
  const invalidate = useCallback(() => {
    return queryClient.invalidateQueries(key);
  }, [queryClient, key]);

  return { communitiesQuery: query, invalidateCommunitiesQuery: invalidate };
};

/**
 * @param id 접속한 커뮤니티의 id
 * 접속한 커뮤니티에서 참여하고 있는 채널 목록
 */
export const useJoinedChannelsQuery = (id: string) => {
  const key = queryKeyCreator.community.all();
  const query = useQuery<CommunitySummaries, AxiosError, JoinedChannel[]>(
    key,
    getCommunities,
    {
      select: (data) => {
        return data.find((community) => community._id === id)?.channels || [];
      },
    },
  );

  return { joinedChannelsQuery: query };
};

interface SetCommunities {
  (
    callback: (
      communities?: CommunitySummaries,
    ) => CommunitySummaries | undefined,
  ): void;
  (communities: CommunitySummaries): void;
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
    queryClient.setQueryData<CommunitySummaries>(key, (communities) => {
      if (typeof cb === 'function') return cb(communities);
      return cb;
    });
  };

  return setCommunities;
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

export const useInviteCommunityMutation = (
  options?: UseMutationOptions<InviteCommunityResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.community.inviteCommunity();
  const mutation = useMutation(key, inviteCommunity, { ...options });

  return mutation;
};
