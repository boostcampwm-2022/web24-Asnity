import type { SuccessResponse } from '@@types/apis/response';
import type {
  CreateCommunityResult,
  CreateCommunityRequest,
} from '@apis/community';
import type { UseMutationOptions } from '@tanstack/react-query';

import { createCommunity } from '@apis/community';
import { useMutation } from '@tanstack/react-query';
import queryKeyCreator from 'src/queryKeyCreator';

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
