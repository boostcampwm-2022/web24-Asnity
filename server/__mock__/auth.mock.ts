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

export const userData = {
  getMyInfo: {
    responseForm: {
      statusCode: 200,
      result: {
        _id: expect.any(String),
        id: 'test@gmail.com',
        nickname: 'test1',
        status: 'ONLINE',
        profileUrl: 'url',
        description: 'default description',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    },
  },
};
