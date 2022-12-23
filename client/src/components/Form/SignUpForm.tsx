import type { SignUpFormFields } from '@components/Form/SignUpFormTypes';
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
  handleSubmitValidSignUpForm: SubmitHandler<SignUpFormFields>;
  handleSubmitInvalidSignUpForm?: SubmitErrorHandler<SignUpFormFields>;
  disableSubmitButton?: boolean;
}

const signUpFormDefaultValues = {
  id: '',
  nickname: '',
  password: '',
  passwordCheck: '',
};

const SignUpForm: FC<Props> = ({
  handleSubmitValidSignUpForm,
  handleSubmitInvalidSignUpForm,
  disableSubmitButton = false,
}) => {
  const { watch, handleSubmit, control } = useForm<SignUpFormFields>({
    mode: 'all',
    defaultValues: signUpFormDefaultValues,
  });

  const password = watch('password');

  const idRules: RegisterOptions<SignUpFormFields, 'id'> = {
    pattern: {
      value: REGEX.EMAIL,
      message: '아이디는 이메일 형식으로 입력해야 합니다!',
    },
    required: '필수 요소입니다!',
  };

  const nicknameRules: RegisterOptions<SignUpFormFields, 'nickname'> = {
    validate: {
      notIncludesWhitespace: (value) =>
        !value.includes(' ') || '공백은 포함될 수 없습니다!',
      nicknameLength: (value) =>
        (value.length >= 2 && value.length <= 8) ||
        '닉네임은 2자 이상, 8자 이하만 가능합니다!',
    },
  };

  const passwordRules: RegisterOptions<SignUpFormFields, 'password'> = {
    validate: (value) =>
      value.length >= 8 || '비밀번호는 8자리 이상이어야 합니다!',
  };

  const passwordCheckRules: RegisterOptions<SignUpFormFields, 'passwordCheck'> =
    {
      validate: {
        equalToPassword: (value) =>
          value === password || '비밀번호와 일치하지 않습니다!',
      },
    };

  return (
    <form
      className="flex flex-col justify-start items-center"
      onSubmit={handleSubmit(
        handleSubmitValidSignUpForm,
        handleSubmitInvalidSignUpForm,
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
        name="nickname"
        control={control}
        rules={nicknameRules}
        render={({ field, formState: { errors } }) => {
          return (
            <ValidationInputWrapper
              errorMessage={errors?.nickname?.message}
              successMessage={field.value && '사용 가능한 닉네임입니다!'}
            >
              <LabelInput type="text" {...field} placeholder="닉네임" />
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

      <Controller
        name="passwordCheck"
        control={control}
        rules={passwordCheckRules}
        render={({ field, formState: { errors } }) => {
          return (
            <ValidationInputWrapper
              errorMessage={errors?.passwordCheck?.message}
              successMessage={field.value && '비밀번호가 일치합니다!'}
            >
              <LabelInput
                type="password"
                {...field}
                placeholder="비밀번호 확인"
              />
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
          회원가입
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
