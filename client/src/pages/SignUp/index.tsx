import type { SignUpFormFields } from '@components/Form/SignUpFormTypes';

import SignUpForm from '@components/Form/SignUpForm';
import Logo from '@components/Logo';
import TextButton from '@components/TextButton';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import { useSignUpMutation } from '@hooks/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();

  const signUpMutation = useSignUpMutation({
    onSuccess: () => {
      toast.success('회원가입에 성공했습니다.');
      navigate('/sign-in');
    },
    onError: (error) => {
      defaultErrorHandler(error);
    },
  });

  const handleSubmitValidSignUpForm = (fields: SignUpFormFields) => {
    signUpMutation.mutate(fields);
  };

  const handleNavigateSignInPage = () => {
    navigate('/sign-in');
  };

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col h-[250px] items-center justify-center">
        <Logo size="lg" />
        <h1 className="font-mont text-[40px] mb-5 capitalize">asnity</h1>
      </div>

      <SignUpForm
        handleSubmitValidSignUpForm={handleSubmitValidSignUpForm}
        disableSubmitButton={signUpMutation.isLoading}
      />

      <TextButton
        size="sm"
        className="text-body"
        type="button"
        onClick={handleNavigateSignInPage}
      >
        로그인 페이지로
      </TextButton>
    </main>
  );
};

export default SignUp;
