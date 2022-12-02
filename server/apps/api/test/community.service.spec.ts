import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { CommunityService } from '@api/src/community/community.service';
import { Community } from '@schemas/community.schema';
import { CommunityRepository } from '@repository/community.repository';
import { user1 } from '@mock/user.mock';
import { UserRepository } from '@repository/user.repository';
import { communityDto1 } from '@mock/community.mock';
import { User } from '@schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect } from 'mongoose';
import { Channel } from '@schemas/channel.schema';
import { ChannelRepository } from '@repository/channel.repository';

describe('[Community Service]', () => {
  let communityService: CommunityService;
  let communityRepository: CommunityRepository;
  let userRepository: UserRepository;
  let chaneelRepository: ChannelRepository;
  let mongodb, mongoConnection;
  let communityModel, userModel, channelModel;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    mongoConnection = (await connect(uri)).connection;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        CommunityRepository,
        UserRepository,
        ChannelRepository,
        {
          provide: getModelToken(Community.name),
          useFactory: () => {},
        },
        {
          provide: getModelToken(User.name),
          useFactory: () => {},
        },
        {
          provide: getModelToken(Channel.name),
          useFactory: () => {},
        },
      ],
    }).compile();
    communityService = module.get<CommunityService>(CommunityService);
    communityRepository = module.get<CommunityRepository>(CommunityRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    chaneelRepository = module.get<ChannelRepository>(ChannelRepository);
  });

  it('should be defined', () => {
    expect(communityService).toBeDefined();
  });

  describe('[createCommunity] 커뮤니티 생성', () => {
    it('커뮤니티 생성 정상 동작', async () => {
      // const community1 = _.cloneDeep(user1);
      // community1.users = [user1._id];
      // jest.spyOn(userRepository, 'updateObject'); //.mockResolvedValue(user1);
      // jest.spyOn(communityRepository, 'create'); //.mockResolvedValue(community1);
      // const result = await communityService.createCommunity(communityDto1);
      // expect(result).toEqual(community1);
    });
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongodb.stop();
  });
});
