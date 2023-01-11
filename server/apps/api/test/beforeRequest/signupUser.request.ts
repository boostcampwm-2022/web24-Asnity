import * as request from 'supertest';
import { signupURL } from '@api/test/urls/urls';

export const signupUserRequest = async (server, user) => {
  await request(server).post(signupURL).send({
    id: user.id,
    password: user.password,
    nickname: user.nickname,
  });
};
