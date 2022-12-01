import type { SignUpRequest, SignUpResult } from '@apis/auth';
import type { UseMutationOptions } from '@tanstack/react-query';

import { signUp } from '@apis/auth';
import { useMutation } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useSignUpMutation = (
  options: UseMutationOptions<SignUpResult, unknown, SignUpRequest>,
) => {
  const key = queryKeyCreator.signUp();
  const mutation = useMutation(key, signUp, {
    ...options,
  });

  return mutation;
};

export default useSignUpMutation;
