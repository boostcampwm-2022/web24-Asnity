export const authData = {
  signup: {
    requestForm: {
      id: 'testUser@naver.com',
      password: '12341234',
      nickname: 'testUser',
    },
    responseForm: {
      message: '회원가입 성공!',
    },
  },
  signin: {
    requestForm: {
      id: 'testUser@naver.com',
      password: '12341234',
    },
    responseForm: {
      message: '로그인 성공!',
      accessToken: expect.any(String),
    },
  },
  signout: {
    responseForm: {
      message: '로그아웃 성공!',
    },
  },
};
