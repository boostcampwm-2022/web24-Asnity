import SignUpForm from '@components/Form/SignUpForm';
import userEvent from '@testing-library/user-event';
import { render } from '@utils/testUtils';
import React from 'react';

const renderSignUpForm = () => {
  const handleSubmitValidSignUpForm = jest.fn();
  const result = render(
    <SignUpForm handleSubmitValidSignUpForm={handleSubmitValidSignUpForm} />,
  );

  const idField = () => result.getByPlaceholderText('아이디');
  const nicknameField = () => result.getByPlaceholderText('닉네임');
  const passwordField = () => result.getByPlaceholderText('비밀번호');
  const passwordCheckField = () => result.getByPlaceholderText('비밀번호 확인');
  const submitButton = () => result.getByText('회원가입');

  const changeIdField = (value: string) => userEvent.type(idField(), value);
  const changeNicknameField = (value: string) =>
    userEvent.type(nicknameField(), value);
  const changePasswordField = (value: string) =>
    userEvent.type(passwordField(), value);
  const changePasswordCheckField = (value: string) =>
    userEvent.type(passwordCheckField(), value);
  const clickSubmitButton = () => userEvent.click(submitButton());

  return {
    result,
    idField,
    nicknameField,
    passwordField,
    passwordCheckField,
    submitButton,
    changeIdField,
    changeNicknameField,
    changePasswordField,
    changePasswordCheckField,
    clickSubmitButton,
    handleSubmitValidSignUpForm,
  };
};

describe('SignUpForm 컴포넌트', () => {
  it('id, nickname, password, passwordCheck input 필드가 렌더링된다.', () => {
    const { idField, nicknameField, passwordField, passwordCheckField } =
      renderSignUpForm();

    expect(idField()).toBeInTheDocument();
    expect(nicknameField()).toBeInTheDocument();
    expect(passwordField()).toBeInTheDocument();
    expect(passwordCheckField()).toBeInTheDocument();
  });

  it('제출 양식에 맞게 입력한 후, 제출 버튼을 누르면 handleSubmitValidSignUpForm 핸들러가 실행된다.', async () => {
    const {
      handleSubmitValidSignUpForm,
      clickSubmitButton,
      changeIdField,
      changeNicknameField,
      changePasswordField,
      changePasswordCheckField,
    } = renderSignUpForm();

    const data = {
      id: 'asd@asd.com',
      nickname: 'asdf',
      password: '12341234',
      passwordCheck: '12341234',
    };

    await changeIdField(data.id);
    await changeNicknameField(data.nickname);
    await changePasswordField(data.password);
    await changePasswordCheckField(data.passwordCheck);
    await clickSubmitButton();

    expect(handleSubmitValidSignUpForm).toBeCalled();
  });

  it('제출 양식에 맞지 않게 입력하고, 제출 버튼을 누르면 handleSubmitValidSignUpForm 핸들러가 실행되지 않는다.', async () => {
    const {
      handleSubmitValidSignUpForm,
      clickSubmitButton,
      changeIdField,
      changeNicknameField,
      changePasswordField,
      changePasswordCheckField,
    } = renderSignUpForm();

    const data = {
      id: 'asd@asd.',
      nickname: 'asdf',
      password: '12341234',
      passwordCheck: '12341234',
    };

    await changeIdField(data.id);
    await changeNicknameField(data.nickname);
    await changePasswordField(data.password);
    await changePasswordCheckField(data.passwordCheck);
    await clickSubmitButton();

    expect(handleSubmitValidSignUpForm).not.toBeCalled();
  });
});
