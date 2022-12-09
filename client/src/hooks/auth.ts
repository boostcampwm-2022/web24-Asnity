import type {
  SignOutResult,
  SignInRequest,
  SignInResult,
  SignUpRequest,
  SignUpResult,
} from '@apis/auth';
import type { GetMyInfoResult } from '@apis/user';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { signOut, signIn, signUp } from '@apis/auth';
import { getMyInfo } from '@apis/user';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import queryKeyCreator from '@/queryKeyCreator';

export const useSignUpMutation = (
  options: UseMutationOptions<SignUpResult, unknown, SignUpRequest>,
) => {
  const key = queryKeyCreator.signUp();
  const mutation = useMutation(key, signUp, {
    ...options,
  });

  return mutation;
};

export const useSignInMutation = (
  options: UseMutationOptions<SignInResult, unknown, SignInRequest>,
) => {
  const key = queryKeyCreator.signIn();
  const mutation = useMutation(key, signIn, {
    ...options,
  });

  return mutation;
};

export const useSignOutMutation = (
  options: UseMutationOptions<SignOutResult, unknown, undefined | null>,
) => {
  const key = queryKeyCreator.signOut();
  const mutation = useMutation(key, signOut, {
    ...options,
  });

  return mutation;
};

/* ============================ [ myInfo ] ================================ */
// 로그인한 사용자의 정보

export const useMyInfoQuery = () => {
  const key = queryKeyCreator.me();
  const query = useQuery<GetMyInfoResult, AxiosError>(key, getMyInfo);

  return query;
};

export const useMyInfoQueryData = () => {
  const queryClient = useQueryClient();
  const key = queryKeyCreator.me();
  const me = queryClient.getQueryData<GetMyInfoResult>(key);

  return me;
};

export const useSetMyInfoQueryData = () => {
  const key = queryKeyCreator.me();
  const queryClient = useQueryClient();

  const removeMyInfoQueryData = () => {
    queryClient.setQueryData(key, () => null);
  };

  return { removeMyInfoQueryData };
};
