import type { SignInRequest } from '@apis/auth';

import SignInForm from '@components/Form/SignInForm';
import Logo from '@components/Logo';
import TextButton from '@components/TextButton';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { useSignInMutation } from '@hooks/auth';
import { useTokenStore } from '@stores/tokenStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);

  const navigate = useNavigate();

  const signInMutation = useSignInMutation({
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      navigate('/dms');
    },
    onError: (error) => {
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

      <SignInForm handleSubmitValidSignInForm={handleSubmitSignInForm} />

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
    </main>
  );
};

export default SignIn;
