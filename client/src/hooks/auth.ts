import type { SignOutResult } from '@apis/auth';
import type { UseMutationOptions } from '@tanstack/react-query';

import { signOut } from '@apis/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

export const useSignOutMutation = (
  options: UseMutationOptions<SignOutResult, unknown, undefined | null>,
) => {
  const key = queryKeyCreator.signOut();
  const mutation = useMutation(key, signOut, {
    ...options,
  });

  return mutation;
};

export const useSetMyInfoQueryData = () => {
  const key = queryKeyCreator.me();
  const queryClient = useQueryClient();
  const removeMyInfoQueryData = () => {
    queryClient.setQueryData(key, () => null);
  };

  return { removeMyInfoQueryData };
};
