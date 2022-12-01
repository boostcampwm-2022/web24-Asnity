import { faker } from '@faker-js/faker';

import { chancify } from '../utils/rand';
import { channelUsers } from './users';

export const createMockChannel = () => ({
  _id: faker.datatype.uuid(),
  managerId: faker.datatype.uuid(),
  name: faker.name.jobType(),
  isPrivate: chancify(() => true, 50, false),
  profileUrl: chancify(() => faker.image.avatar(), 50),
  description: faker.lorem.sentence(1),
  lastRead: chancify(() => true, 50, false),
  type: 'Channel',
  users: channelUsers,
});

export const channels = [...Array(10)].map(createMockChannel);

export const createMockCommunities = () => ({
  _id: faker.datatype.uuid(),
  name: faker.name.jobType(),
  managerId: faker.datatype.uuid(),
  profileUrl: chancify(() => faker.image.avatar(), 50),
  description: faker.lorem.sentence(1),
  channels,
});

export const communities = [...Array(15)].map(createMockCommunities);
