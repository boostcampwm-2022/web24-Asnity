import { ObjectId } from 'bson';
import { FollowerDto } from '@user/dto/follower.dto';
// _id: new ObjectId('63734af9e62b37012c73e399'),
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

export const followerDtoMock: FollowerDto = {
  myId: '63734af9e62b37012c73e399',
  followId: '63734e98384f478a32c3a1cc',
};

export const user1Modify = {
  name: '',
  id: 'test_ny@naver.com',
  profileUrl: 'nayoung img modify',
  description: 'hello im nayoung modify',
  status: 'OFFLINE',
} as any;
