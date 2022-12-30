import { ObjectId } from 'bson';

export const initTestUser1 = {
  name: '',
  _id: new ObjectId('63734e98384f478a32c3a1cc'),
  id: 'test@gmail.com',
  password: 'hi12341234',
  nickname: 'test1',
};

export const initTestUser2 = {
  name: '',
  id: 'test_asmi@naver.com',
  password: '12341234',
  nickname: 'asmi',
};

export const user1Modify = {
  name: '',
  id: 'test_ny@naver.com',
  profileUrl: 'nayoung img modify',
  description: 'hello im nayoung modify',
  status: 'OFFLINE',
} as any;
