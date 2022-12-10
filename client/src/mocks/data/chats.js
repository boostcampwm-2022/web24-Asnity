import { faker } from '@faker-js/faker';

import { users } from './users';

let id = 0;

export const createMockChat = () => ({
  id: id++,
  type: 'TEXT',
  content: faker.lorem.sentences(),
  senderId: users[Math.floor(Math.random() * users.length)]._id,
  updatedAt: '',
  createdAt: new Date().toISOString(),
  deletedAt: '',
});

const chatsLength = 60;
const chatCountPerPage = 20;
const chats = [...Array(chatsLength)].map(createMockChat);
const totalPageCount = Math.ceil(chatsLength / chatCountPerPage) - 1;

/**
 * @param cursor {number}
 */
const getChats = (cursor) => {
  if (cursor === -1) {
    return [];
  }

  const start = cursor * chatCountPerPage;
  const end = start + chatCountPerPage;

  return chats.slice(start, end);
};

export default {
  chats,
  chatCountPerPage,
  totalPageCount,
  getChats,
};
