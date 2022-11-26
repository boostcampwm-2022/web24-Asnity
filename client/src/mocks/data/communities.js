import { faker } from '@faker-js/faker';

import { chancify } from '../utils/rand';

export const createMockCommunities = () => ({
  _id: faker.datatype.uuid(),
  name: faker.name.jobType(),
  managerId: faker.datatype.uuid(),
  profileUrl: chancify(() => faker.image.avatar(), 50),
  description: faker.lorem.sentence(1),
});

export const communities = [...Array(15)].map(createMockCommunities);
