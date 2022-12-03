import type { UpdateFollowingResult } from '@apis/user';
import type { UseMutationOptions } from '@tanstack/react-query';

import { updateFollowing } from '@apis/user';
import { useMutation } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useFollowingMutation = (
  options?: UseMutationOptions<UpdateFollowingResult, unknown, unknown>,
) => {
  const key = queryKeyCreator.followings.toggleFollowing();
  const mutation = useMutation(key, updateFollowing, { ...options });

  return mutation;
};

export default useFollowingMutation;
