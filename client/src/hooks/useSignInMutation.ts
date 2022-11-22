import type { SuccessResponse } from '@@types/apis/response';
import type { SignInRequest, SignInResult } from '@apis/auth';
import type { UseMutationOptions } from '@tanstack/react-query';

import { signIn } from '@apis/auth';
import { useMutation } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

const useSignInMutation = (
  options: UseMutationOptions<
    SuccessResponse<SignInResult>,
    unknown,
    SignInRequest
  >,
) => {
  const key = queryKeyCreator.signIn();
  const mutation = useMutation(key, signIn, {
    ...options,
  });

  return mutation;
};

export default useSignInMutation;
