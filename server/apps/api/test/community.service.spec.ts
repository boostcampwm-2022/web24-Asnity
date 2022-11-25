import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { CommunityService } from '@api/src/community/community.service';
import { Community } from '@schemas/community.schema';
import { CommunityRepository } from '@repository/community.repository';
import { user1 } from '@mock/user.mock';
import { UserRepository } from '@repository/user.repository';
import { communityDto1 } from '@mock/community.mock';
import { UserModule } from '@user/user.module';
import { User } from '@schemas/user.schema';

describe('[Community Service]', () => {
  let communityService: CommunityService;
  let communityRepository: CommunityRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        CommunityRepository,
        UserRepository,
        {
          provide: getModelToken(Community.name),
          useFactory: () => {},
        },
        {
          provide: getModelToken(User.name),
          useFactory: () => {},
        },
      ],
    }).compile();

    communityService = module.get<CommunityService>(CommunityService);
    communityRepository = module.get<CommunityRepository>(CommunityRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(communityService).toBeDefined();
  });

  describe('[createCommunity] 커뮤니티 생성', () => {
    it('커뮤니티 생성 정상 동작', async () => {
      const community1 = _.cloneDeep(user1);
      community1.users = [user1._id];
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user1);
      jest.spyOn(communityRepository, 'create').mockResolvedValue(community1);
      const result = await communityService.createCommunity(communityDto1);
      expect(result).toEqual(community1);
    });
  });
});
