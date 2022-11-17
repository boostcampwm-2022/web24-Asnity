import { ObjectId } from 'bson';
import { FollowerDto } from '@user/dto/follower.dto';

export const user1 = {
  name: '',
  _id: new ObjectId('63734af9e62b37012c73e399'),
  id: 'test_ny@naver.com',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$BvMvPrYTKubH8gvHVDe8zw$DTCW9ha7Wsp/jTqrWUmR56w1Z83pWaVN4afaYScvOQY',
  nickname: 'nayoung',
  profileUrl: 'nayoung img',
  description: 'hello im nayoung',
  status: 'OFFLINE',
  lastLogin: '2022-11-15T08:15:54.703Z',
  createdAt: '2022-11-15T08:15:54.703Z',
  updatedAt: '2022-11-15T08:15:54.703Z',
  followings: [],
  followers: ['63739b643969101c3fec8849'],
  communities: [],
} as any;

export const user2 = {
  name: '',
  _id: new ObjectId('63734e98384f478a32c3a1cc'),
  id: 'test_asmi@naver.com',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$gSUGguog1qo9SEZ4Q18iLA$psu/sCkJqMJ0LYQYv7OoatTZwa7/LdYS1vb4GucjCbk',
  nickname: 'asmi',
  profileUrl: 'url',
  description: 'default description asmi',
  status: 'ONLINE',
  lastLogin: '2022-11-15T08:32:15.317Z',
  createdAt: '2022-11-15T08:32:15.317Z',
  updatedAt: '2022-11-15T08:32:15.317Z',
  followings: ['63734f4eca63eaf1876a2c3b', '63743ae79198ef99b097cf57'],
  followers: [],
  communities: [],
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzczNGU5ODM4NGY0NzhhMzJjM2ExY2MiLCJpYXQiOjE2Njg2NzE3ODcsImV4cCI6MTY2ODY3NTM4N30.02nrFeZs_MWbTgXweZ89nONkfALtQqIF66LzXaeK-kQ',
} as any;

export const followerDtoMock: FollowerDto = {
  myId: '63734af9e62b37012c73e399',
  followId: '63734e98384f478a32c3a1cc',
};
