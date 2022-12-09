import type { SignInRequest } from '@apis/auth';

import AuthInput from '@components/AuthInput';
import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import Logo from '@components/Logo';
import TextButton from '@components/TextButton';
import REGEX from '@constants/regex';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { useSignInMutation } from '@hooks/auth';
import { useTokenStore } from '@stores/tokenStore';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const signUpFormDefaultValues = {
  id: '',
  password: '',
};

const SignIn = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const { control, handleSubmit, reset } = useForm<SignInRequest>({
    mode: 'all',
    defaultValues: signUpFormDefaultValues,
  });

  const navigate = useNavigate();

  const signInMutation = useSignInMutation({
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      navigate('/dms');
    },
    onError: (error) => {
      reset();
      defaultErrorHandler(error);
    },
  });

  const handleSubmitSignInForm = ({ id, password }: SignInRequest) => {
    signInMutation.mutate({ id, password });
  };

  const handleNavigateSignUpPage = () => {
    navigate('/sign-up');
  };

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
              value: REGEX.EMAIL,
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
            disabled={signInMutation.isLoading}
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
