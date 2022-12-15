import { render, screen } from '@utils/testUtils';
import React from 'react';

import SignUp from './index';

describe('회원가입 테스트', () => {
  it('네 개의 input 필드가 렌더링된다.', () => {
    render(<SignUp />);

    const $$text = screen.getAllByPlaceholderText(/(.*)/);

    console.log($$text);
    expect($$text).toHaveFormValues({
      id: '',
      nickname: '',
      password: '',
      passwordCheck: '',
    });
  });
});
