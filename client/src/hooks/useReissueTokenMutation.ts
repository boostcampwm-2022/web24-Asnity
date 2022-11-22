import type { ErrorResponse, SuccessResponse } from '@@types/apis/response';
import type { ReissueTokenResult } from '@apis/auth';
import type { UseMutationResult } from '@tanstack/react-query';

import { reissueToken } from '@apis/auth';
import { useTokenStore } from '@stores/tokenStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import queryKeyCreator from '@/queryKeyCreator';

type UseReissueTokenMutationResult = UseMutationResult<
  SuccessResponse<ReissueTokenResult>,
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
const useReissueTokenMutation: UseReissueTokenMutation = (
  invalidTokenErrorFallback,
  unknownErrorFallback,
) => {
  const navigate = useNavigate();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const key = queryKeyCreator.reissueToken();
  const mutation = useMutation(key, reissueToken, {
    onSuccess: (data) => {
      setAccessToken(data.result.accessToken);
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
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

export default useReissueTokenMutation;
