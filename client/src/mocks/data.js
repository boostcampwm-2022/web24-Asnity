import { getRandomInt } from './utils/rand';

export const users = [
  {
    _id: 'a',
    id: '1',
    nickname: '나영',
    status: 'online',
    profileUrl: `https://picsum.photos/id/${getRandomInt(1000)}/70`,
    description: 'default description',
  },
  {
    _id: 'b',
    id: '2',
    nickname: '수만',
    status: 'offline',
    profileUrl: `https://picsum.photos/id/${getRandomInt(1000)}/70`,
    description: 'default descrption',
  },
  {
    _id: 'c',
    id: '3',
    nickname: '민종',
    status: 'afk',
    profileUrl: `https://picsum.photos/id/${getRandomInt(1000)}/70`,
    description: 'default descrption',
  },
  {
    _id: 'd',
    id: '4',
    nickname: '준영',
    status: 'afk',
    profileUrl: `https://picsum.photos/id/${getRandomInt(1000)}/70`,
    description: 'default descrption',
  },
];
