import * as request from 'supertest';
import { communityDto1 } from '@mock/community.mock';

export const createCommunityRequest = async (server, accessToken) => {
  await request(server)
    .post(`/api/community`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(communityDto1);
};
