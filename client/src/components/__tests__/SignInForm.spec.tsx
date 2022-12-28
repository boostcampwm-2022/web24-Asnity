import SignInForm from '@components/Form/SignInForm';
import userEvent from '@testing-library/user-event';
import { render } from '@utils/testUtils';
import React from 'react';

const renderSignInForm = () => {
  const handleSubmitValidSignInForm = jest.fn();
  const result = render(
    <SignInForm handleSubmitValidSignInForm={handleSubmitValidSignInForm} />,
  );

  const idField = () => result.getByPlaceholderText('아이디');
  const passwordField = () => result.getByPlaceholderText('비밀번호');
  const submitButton = () => result.getByText('로그인');

  const changeIdField = (value: string) => userEvent.type(idField(), value);
  const changePasswordField = (value: string) =>
    userEvent.type(passwordField(), value);
  const clickSubmitButton = () => userEvent.click(submitButton());

  return {
    result,
    idField,
    passwordField,
    submitButton,
    changeIdField,
    changePasswordField,
    clickSubmitButton,
    handleSubmitValidSignInForm,
  };
};

describe('SignInForm 컴포넌트', () => {
  it('id, password input 필드가 렌더링된다.', () => {
    const { idField, passwordField } = renderSignInForm();

    expect(idField()).toBeInTheDocument();
    expect(passwordField()).toBeInTheDocument();
  });

  it('제출 양식에 맞게 입력한 후, 제출 버튼을 누르면 handleSubmitValidSignInForm 핸들러가 실행된다.', async () => {
    const {
      handleSubmitValidSignInForm,
      clickSubmitButton,
      changeIdField,
      changePasswordField,
    } = renderSignInForm();

    const data = {
      id: 'asd@asd.com',
      password: '12341234',
    };

    await changeIdField(data.id);
    await changePasswordField(data.password);
    await clickSubmitButton();

    expect(handleSubmitValidSignInForm).toBeCalled();
  });

  it('제출 양식에 맞지 않게 입력하고, 제출 버튼을 누르면 handleSubmitValidSignInForm 핸들러가 실행되지 않는다.', async () => {
    const {
      clickSubmitButton,
      changeIdField,
      changePasswordField,
      handleSubmitValidSignInForm,
    } = renderSignInForm();

    const data = {
      id: 'asd@asd.',
      password: '12341234',
    };

    await changeIdField(data.id);
    await changePasswordField(data.password);
    await clickSubmitButton();

    expect(handleSubmitValidSignInForm).not.toBeCalled();
  });
});
