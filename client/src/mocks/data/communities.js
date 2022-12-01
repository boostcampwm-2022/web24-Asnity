import { faker } from '@faker-js/faker';

import { chancify } from '../utils/rand';
import { channelUsers, users } from './users';

export const createMockChannel = () => ({
  _id: faker.datatype.uuid(),
  managerId: users[0]._id,
  name: faker.name.jobType(),
  isPrivate: chancify(() => true, 50, false),
  profileUrl: chancify(() => faker.image.city(640, 480, true), 50),
  description: faker.lorem.sentence(1),
  lastRead: chancify(() => true, 50, false),
  type: 'Channel',
  users: channelUsers,
  createdAt: new Date().toISOString(),
});

export const channels = [...Array(10)].map(createMockChannel);

export const createMockCommunities = () => ({
  _id: faker.datatype.uuid(),
  name: faker.name.jobType(),
  managerId: faker.datatype.uuid(),
  profileUrl: chancify(() => faker.image.nature(300, 300, true), 50),
  description: faker.lorem.sentence(1),
  channels,
});

export const communities = [...Array(15)].map(createMockCommunities);
