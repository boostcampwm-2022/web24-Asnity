import type { SignInRequest } from '@apis/auth';
import type { ComponentPropsWithoutRef, FC } from 'react';
import type {
  SubmitErrorHandler,
  SubmitHandler,
  RegisterOptions,
} from 'react-hook-form';

import Button from '@components/Button';
import LabelInput from '@components/LabelInput';
import ValidationInputWrapper from '@components/ValidationInputWrapper';
import REGEX from '@constants/regex';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

interface Props extends ComponentPropsWithoutRef<'form'> {
  handleSubmitValidSignInForm: SubmitHandler<SignInRequest>;
  handleSubmitInvalidSignInForm?: SubmitErrorHandler<SignInRequest>;
  disableSubmitButton?: boolean;
}

const signInFormDefaultValues = {
  id: '',
  nickname: '',
  password: '',
};

const SignInForm: FC<Props> = ({
  handleSubmitValidSignInForm,
  handleSubmitInvalidSignInForm,
  disableSubmitButton = false,
}) => {
  const { handleSubmit, control } = useForm<SignInRequest>({
    mode: 'all',
    defaultValues: signInFormDefaultValues,
  });

  const idRules: RegisterOptions<SignInRequest, 'id'> = {
    pattern: {
      value: REGEX.EMAIL,
      message: '아이디는 이메일 형식으로 입력해야 합니다!',
    },
  };

  const passwordRules: RegisterOptions<SignInRequest, 'password'> = {
    validate: (value) =>
      value.length >= 8 || '비밀번호는 8자리 이상이어야 합니다!',
  };

  return (
    <form
      className="flex flex-col justify-start items-center"
      onSubmit={handleSubmit(
        handleSubmitValidSignInForm,
        handleSubmitInvalidSignInForm,
      )}
    >
      <Controller
        name="id"
        control={control}
        rules={idRules}
        render={({ field, formState: { errors } }) => {
          return (
            <ValidationInputWrapper
              errorMessage={errors?.id?.message}
              successMessage={field.value && '올바른 이메일 형식입니다!'}
            >
              <LabelInput type="text" {...field} placeholder="아이디" />
            </ValidationInputWrapper>
          );
        }}
      />

      <Controller
        name="password"
        control={control}
        rules={passwordRules}
        render={({ field, formState: { errors } }) => {
          return (
            <ValidationInputWrapper
              errorMessage={errors?.password?.message}
              successMessage={field.value && '사용 가능한 비밀번호입니다!'}
            >
              <LabelInput type="password" {...field} placeholder="비밀번호" />
            </ValidationInputWrapper>
          );
        }}
      />

      <div className="mb-5">
        <Button
          color="primary"
          size="md"
          type="submit"
          minWidth={340}
          disabled={disableSubmitButton}
        >
          로그인
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;
