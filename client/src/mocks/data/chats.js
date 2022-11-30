import { faker } from '@faker-js/faker';

export const createMockChat = () => ({
  id: faker.datatype.uuid(),
  type: 'TEXT',
  content: faker.lorem.sentences(),
  senderId: faker.datatype.uuid(),
  updatedAt: '',
  createdAt: new Date().toISOString(),
  deletedAt: '',
});

export const chats = [...Array(20)].map(createMockChat);
