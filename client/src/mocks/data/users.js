import { faker } from '@faker-js/faker';

import { getRandomInt } from '../utils/rand';

export const createMockUser = () => ({
  _id: faker.datatype.uuid(),
  id: faker.internet.email(),
  nickname: faker.name.fullName(),
  status: ['online', 'offline', 'afk'][getRandomInt(3)],
  profileUrl: faker.image.avatar(),
  description: faker.lorem.sentence(),
});

export const users = [...Array(30)].map(createMockUser);
