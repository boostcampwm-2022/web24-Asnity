export const authData = {
  signup: {
    requestForm: {
      id: 'testUser1@naver.com',
      password: '12341234',
      nickname: 'testUser',
    },
    responseForm: {
      statusCode: 200,
      result: {
        message: '회원가입 성공!',
      },
    },
  },
  signin: {
    requestForm: {
      id: 'testUser1@naver.com',
      password: '12341234',
    },
    responseForm: {
      statusCode: 200,
      result: {
        message: '로그인 성공!',
        accessToken: expect.any(String),
      },
    },
  },
  signout: {
    responseForm: {
      statusCode: 200,
      result: {
        message: '로그아웃 성공!',
      },
    },
  },
};
