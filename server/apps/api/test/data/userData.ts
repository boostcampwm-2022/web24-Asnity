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
