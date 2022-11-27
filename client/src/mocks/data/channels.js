import { faker } from '@faker-js/faker';

import { chancify, getRandomBool } from '../utils/rand';

export const createChannels = () => ({
  id: faker.datatype.uuid(),
  managerId: faker.datatype.uuid(),
  name: faker.lorem.word(),
  users: [...Array(10)].map(() => faker.datatype.uuid()),
  profileUrl: chancify(() => faker.image.avatar(), 50),
  description: faker.lorem.sentence(1),
  isPrivate: getRandomBool(),
});

export const channels = [...Array(10)].map(createChannels);
