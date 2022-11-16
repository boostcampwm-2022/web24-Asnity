import AuthInput from '@components/AuthInput';
import ErrorMessage from '@components/ErrorMessage';
import Logo from '@components/Logo';
import SuccessMessage from '@components/SuccessMessage';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

const SignUp = () => {
  const { control, handleSubmit, watch } = useForm<{
    id: string;
    nickname: string;
    password: string;
    passwordCheck: string;
  }>({
    mode: 'all',
    defaultValues: {
      id: '',
      nickname: '',
      password: '',
      passwordCheck: '',
    },
  });

  const password = watch('password');

  return (
    <main>
      <form
        className="flex flex-col justify-start items-center h-screen pt-10"
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <Logo size="lg" />
        <h1 className="font-mont text-[40px] mb-5 capitalize">asnity</h1>

        <Controller
          name="id"
          control={control}
          rules={{
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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
              moreThan2Chars: (value) =>
                value.length >= 2 || '닉네임은 두 글자 이상이어야 합니다!',
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

        <button type="submit">회원가입</button>
        <button type="button">로그인 페이지로</button>
      </form>
    </main>
  );
};

export default SignUp;
