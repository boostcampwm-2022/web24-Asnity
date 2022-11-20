import AuthInput from '@components/AuthInput';
import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import Logo from '@components/Logo';
import TextButton from '@components/TextButton';
import { API_URL } from '@constants/url';
import { useTokenStore } from '@stores/tokenStore';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SignInFields {
  id: string;
  password: string;
}

interface SuccessResponse<T> {
  statusCode: number;
  result: T;
}

type SignInApi = (
  fields: SignInFields,
) => Promise<SuccessResponse<{ _id: string; accessToken: string }>>;

const endPoint = `${API_URL}/api/user/auth/signin`;

const signInApi: SignInApi = ({ id, password }) => {
  return axios
    .post(endPoint, { id, password })
    .then((response) => response.data);
};
// 액세스 토큰으로 다시 유저 정보 요청해야함
// _id, id(이메일), nickname, status, profileUrl, description

const SignIn = () => {
  const accessToken = useTokenStore((state) => state.accessToken);
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const { control, handleSubmit, reset } = useForm<SignInFields>({
    mode: 'all',
    defaultValues: {
      id: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const signInMutate = useMutation(['signIn'], signInApi, {
    onSuccess: (data) => {
      setAccessToken(data.result.accessToken);
    },
    onError: (error) => {
      reset();
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.message || '에러가 발생했습니다!';

        if (Array.isArray(errorMessage)) {
          errorMessage.forEach((message) => {
            toast.error(message);
          });
          return;
        }

        toast.error(errorMessage);
        return;
      }

      toast.error('Unknown Error');
    },
  });

  const handleSubmitSignInForm = ({ id, password }: SignInFields) => {
    signInMutate.mutate({ id, password });
  };

  const handleNavigateSignUpPage = () => {
    navigate('/sign-up');
  };

  if (accessToken) {
    return <Navigate to="/dms" />;
  }

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col h-[250px] items-center justify-center">
        <Logo size="lg" />
        <h1 className="font-mont text-[40px] mb-5 capitalize">asnity</h1>
      </div>

      <form
        className="flex flex-col justify-start items-center"
        onSubmit={handleSubmit(handleSubmitSignInForm)}
      >
        <Controller
          name="id"
          control={control}
          rules={{
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: '아이디는 이메일 형식으로 입력해야 합니다!',
            },
          }}
          render={({ field, formState: { errors } }) => {
            return (
              <div className="mb-5">
                <AuthInput {...field} type="text" placeholder="아이디" />
                <div className="pl-6">
                  {errors?.id && (
                    <ErrorMessage>{errors.id.message}</ErrorMessage>
                  )}
                </div>
              </div>
            );
          }}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            validate: (value) =>
              value.length >= 8 || '비밀번호는 8자리 이상이어야 합니다!',
          }}
          render={({ field, formState: { errors } }) => {
            return (
              <div className="mb-5">
                <AuthInput {...field} type="password" placeholder="비밀번호" />
                {
                  <div className="pl-6">
                    {errors?.password && (
                      <ErrorMessage>{errors?.password.message}</ErrorMessage>
                    )}
                  </div>
                }
              </div>
            );
          }}
        />

        <div className="mb-5">
          <Button
            color="primary"
            size="md"
            type="submit"
            minWidth={340}
            disabled={signInMutate.isLoading}
          >
            로그인
          </Button>
        </div>

        <div>
          <TextButton
            size="sm"
            className="text-body"
            type="button"
            onClick={handleNavigateSignUpPage}
          >
            회원가입
          </TextButton>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
