import type { ErrorResponse } from '@@types/apis/response';
import type {
  SignOutResult,
  SignInRequest,
  SignInResult,
  SignUpRequest,
  SignUpResult,
  ReissueTokenResult,
} from '@apis/auth';
import type { GetMyInfoResult } from '@apis/user';
import type {
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { signOut, signIn, signUp, reissueToken } from '@apis/auth';
import { getMyInfo } from '@apis/user';
import { useTokenStore } from '@stores/tokenStore';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

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

type UseReissueTokenMutationResult = UseMutationResult<
  ReissueTokenResult,
  unknown,
  void,
  unknown
>;

interface UseReissueTokenMutation {
  (
    invalidTokenErrorFallback?: string | (() => void),
    unknownErrorFallback?: string | (() => void),
  ): UseReissueTokenMutationResult;
}

/**
 * @description 서버에서 401 에러가 발생하는 경우에만 accessToken을 리셋하기 때문에, 그 이외의 에러로 로그인이 풀리지는 않음.
 */
export const useReissueTokenMutation: UseReissueTokenMutation = (
  invalidTokenErrorFallback,
  unknownErrorFallback,
) => {
  const navigate = useNavigate();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const key = queryKeyCreator.reissueToken();
  const mutation = useMutation(key, reissueToken, {
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        console.error(error);
        return;
      }

      const errorResponse = error.response?.data as ErrorResponse | undefined;

      /** 유효하지 않은 토큰 */
      if (errorResponse?.statusCode === 401) {
        setAccessToken(null);
        if (typeof invalidTokenErrorFallback === 'string')
          navigate(invalidTokenErrorFallback);
        else invalidTokenErrorFallback && invalidTokenErrorFallback();

        return;
      }

      /** 네트워크 오류나 기타 서버 오류 등 */
      if (typeof unknownErrorFallback === 'string') {
        navigate(unknownErrorFallback);
      } else unknownErrorFallback && unknownErrorFallback();
    },
  });

  return mutation;
};

/* ============================ [ myInfo ] ================================ */
// 로그인한 사용자의 정보

export const useMyInfoQuery = () => {
  const key = queryKeyCreator.me();
  const query = useQuery<GetMyInfoResult, AxiosError>(key, getMyInfo, {
    staleTime: 1000 * 100,
  });

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
