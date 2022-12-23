import * as request from 'supertest';
import { signinURL } from '@api/test/urls/urls';

export const signinUserRequest = async (server, id, password) => {
  return (await request(server).post(signinURL).send({ id, password })).body.result.accessToken;
};
