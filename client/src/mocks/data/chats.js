import { faker } from '@faker-js/faker';

import { users } from './users';

export const createMockChat = () => ({
  id: faker.datatype.uuid(),
  type: 'TEXT',
  content: faker.lorem.sentences(),
  senderId: users[0]._id,
  updatedAt: '',
  createdAt: new Date().toISOString(),
  deletedAt: '',
});

export const chats = [...Array(20)].map(createMockChat);
