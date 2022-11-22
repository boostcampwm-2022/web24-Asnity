import type { SignUpRequest } from '@apis/auth';

import AuthInput from '@components/AuthInput';
import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import Logo from '@components/Logo';
import SuccessMessage from '@components/SuccessMessage';
import TextButton from '@components/TextButton';
import REGEX from '@constants/regex';
import defaultErrorHandler from '@errors/defaultErrorHandler';
import useSignUpMutation from '@hooks/useSignUpMutation';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SignUpFormFields extends SignUpRequest {
  passwordCheck: string;
}

interface SuccessResponse<T> {
  statusCode: number;
  result: T;
}

type SignUpApi = (
  fields: Omit<SignUpFields, 'passwordCheck'>,
) => Promise<SuccessResponse<{ message: string }>>;

const endPoint = `${API_URL}/api/user/auth/signup`;

const signUpApi: SignUpApi = ({ id, nickname, password }) => {
  return axios
    .post(endPoint, { id, nickname, password })
    .then((response) => response.data);
};

const SignUp = () => {
  // TODO: 리팩토링 하자
  const { control, handleSubmit, watch, reset } = useForm<SignUpFields>({
    mode: 'all',
    defaultValues: {
      id: '',
      nickname: '',
      password: '',
      passwordCheck: '',
    },
  });

  const navigate = useNavigate();

  const signUpMutation = useSignUpMutation({
    onSuccess: () => {
      toast.success('회원가입에 성공했습니다.');
      reset();
    },
    onError: (error) => {
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

  const handleSubmitSignUpForm = (fields: SignUpFormFields) => {
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

      <form
        className="flex flex-col justify-start items-center"
        onSubmit={handleSubmit(handleSubmitSignUpForm)}
      >
        <Controller
          name="id"
          control={control}
          rules={{
            pattern: {
              value: REGEX.EMAIL,
              message: '아이디는 이메일 형식으로 입력해야 합니다!',
            },
            required: '필수 요소입니다!',
          }}
          render={({ field, formState: { errors } }) => {
            return (
              <div className="mb-5">
                <AuthInput {...field} type="text" placeholder="아이디" />
                <div className="pl-6">
                  {errors?.id ? (
                    <ErrorMessage>{errors.id.message}</ErrorMessage>
                  ) : (
                    field.value && (
                      <SuccessMessage>올바른 이메일 형식입니다!</SuccessMessage>
                    )
                  )}
                </div>
              </div>
            );
          }}
        />

        <Controller
          name="nickname"
          control={control}
          rules={{
            validate: {
              notIncludesWhitespace: (value) =>
                !value.includes(' ') || '공백은 포함될 수 없습니다!',
              nicknameLength: (value) =>
                (value.length >= 2 && value.length <= 8) ||
                '닉네임은 2자 이상, 8자 이하만 가능합니다!',
            },
          }}
          render={({ field, formState: { errors } }) => {
            return (
              <div className="mb-5">
                <AuthInput {...field} type="text" placeholder="닉네임" />
                <div className="pl-6">
                  {errors?.nickname ? (
                    <ErrorMessage>{errors.nickname.message}</ErrorMessage>
                  ) : (
                    field.value && (
                      <SuccessMessage>사용 가능한 닉네임입니다!</SuccessMessage>
                    )
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
                    {errors?.password ? (
                      <ErrorMessage>{errors?.password.message}</ErrorMessage>
                    ) : (
                      field.value && (
                        <SuccessMessage>
                          사용 가능한 비밀번호입니다!
                        </SuccessMessage>
                      )
                    )}
                  </div>
                }
              </div>
            );
          }}
        />

        <Controller
          name="passwordCheck"
          control={control}
          rules={{
            validate: {
              equalToPassword: (value) =>
                value === password || '비밀번호와 일치하지 않습니다!',
            },
          }}
          render={({ field, formState: { errors } }) => {
            return (
              <div className="mb-5">
                <AuthInput
                  {...field}
                  type="password"
                  placeholder="비밀번호 확인"
                />
                <div className="pl-6">
                  {errors.passwordCheck ? (
                    <ErrorMessage>{errors?.passwordCheck.message}</ErrorMessage>
                  ) : (
                    field.value && (
                      <SuccessMessage>비밀번호가 일치합니다!</SuccessMessage>
                    )
                  )}
                </div>
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
            disabled={signUpMutation.isLoading}
          >
            회원가입
          </Button>
        </div>

        <div>
          <TextButton
            size="sm"
            className="text-body"
            type="button"
            onClick={handleNavigateSignInPage}
          >
            로그인 페이지로
          </TextButton>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
