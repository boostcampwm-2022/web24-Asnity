import { faker } from '@faker-js/faker';

import { getRandomInt } from '../utils/rand';

export const createMockUser = () => ({
  _id: faker.datatype.uuid(),
  id: faker.internet.email(),
  nickname: faker.name.fullName(),
  status: ['ONLINE', 'OFFLINE', 'AFK'][getRandomInt(3)],
  profileUrl: faker.image.cats(300, 300, true),
  description: faker.lorem.sentence(),
  createdAt: '2022-12-01T21:17:09.270Z',
});

export const users = [...Array(30)].map(createMockUser);
export const me = users.at(0);
export const communityUsers = users.slice(0, 10);
export const channelUsers = users.slice(0, 10);
export const followings = users.slice(2, 5);
export const followers = users.slice(2, 7);
