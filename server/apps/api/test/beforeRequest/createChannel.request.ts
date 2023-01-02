import * as request from 'supertest';

export const createChannelRequest = async (server, accessToken, channelDto) => {
  await request(server)
    .post(`/api/channel`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(channelDto);
};
