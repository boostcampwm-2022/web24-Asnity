import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@user/user.service';
import { UserRepository } from '@repository/user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { followerDtoMock, user1, user1Modify, user2 } from '@mock/user.mock';
import { User } from '@schemas/user.schema';
import * as _ from 'lodash';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { getUserBasicInfo } from '@user/helper/getUserBasicInfo';

describe('[User Service]', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const user1Append = _.cloneDeep(user1);
  user1Append.followings.push(followerDtoMock.followId);
  const user2Append = _.cloneDeep(user2);
  user2Append.followers.push(followerDtoMock.myId);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useFactory: () => {},
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('[toggleFollowing] 팔로잉, 언팔로잉', () => {
    it('팔로잉 정상 동작', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);
      jest
        .spyOn(userRepository, 'appendElementAtArr')
        .mockResolvedValueOnce(user1Append)
        .mockResolvedValueOnce(user2Append);
      expect(await userService.toggleFollowing(followerDtoMock)).toEqual({
        message: '팔로우 신청 완료',
      });
    });

    it('언팔로잉 정상 동작', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user1Append)
        .mockResolvedValueOnce(user2Append);
      jest
        .spyOn(userRepository, 'deleteElementAtArr')
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);
      expect(await userService.toggleFollowing(followerDtoMock)).toEqual({
        message: '언팔로우 완료',
      });
    });

    it('팔로우 하지 않았으나 상대방이 팔로우 한 경우 에러', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2Append);

      try {
        await userService.toggleFollowing(followerDtoMock);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe('갱신 이상! (팔로우 안되어있으나, 상대방에겐 내가 팔로우됨)');
      }
    });

    it('팔로우 되어있으나, 상대방에겐 내가 팔로우되어있지 않은 경우 에러', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user1Append)
        .mockResolvedValueOnce(user2);

      try {
        await userService.toggleFollowing(followerDtoMock);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe(
          '갱신 이상! (팔로우 되어있으나, 상대방에겐 내가 팔로우되어있지 않음)',
        );
      }
    });

    // it('사용자가 없는 경우 에러', async () => {
    //   jest.spyOn(userRepository, 'findById').mockResolvedValue({} as any);
    //
    //   try {
    //     await userService.toggleFollowing(followerDtoMock);
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(BadRequestException);
    //     expect(e.message).toBe('해당하는 사용자의 _id가 올바르지 않습니다.');
    //   }
    // });
  });

  describe('[getUser] 사용자 정보 검색', () => {
    it('팔로잉 정상 동작', async () => {
      jest.spyOn(userRepository, 'findOr').mockResolvedValueOnce([user1, user2]);
      expect(await userService.getUser('test')).toEqual([
        getUserBasicInfo(user1),
        getUserBasicInfo(user2),
      ]);
    });
  });

  describe('[getRelatedUsers] 나의 팔로잉 정보', () => {
    it('팔로잉 정보 정상 동작', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user1Append)
        .mockResolvedValueOnce(user2Append);
      expect(await userService.getRelatedUsers('test', 'followings')).toEqual([
        getUserBasicInfo(user2Append),
      ]);
    });

    it('팔로워 정보 정상 동작', async () => {
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValueOnce(user2Append)
        .mockResolvedValueOnce(user1Append);
      expect(await userService.getRelatedUsers('test', 'followers')).toEqual([
        getUserBasicInfo(user1Append),
      ]);
    });
  });

  describe('[modifyUser] 사용자 정보 수', () => {
    it('정보 수정 정상 동작', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(user1);
      jest.spyOn(userRepository, 'updateOne').mockResolvedValue();
      expect(await userService.modifyUser(user1Modify)).toBeUndefined();
    });
  });
});
