import * as request from 'supertest';

export const createCommunityRequest = async (server, accessToken, communityDto) => {
  await request(server)
    .post(`/api/community`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(communityDto);
};
