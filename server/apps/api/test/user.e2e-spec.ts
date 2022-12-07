import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import {
  mongoDbServerCleanup,
  mongoDbServerModule,
  mongoDbServerStop,
} from '@api/modules/mongo-server.module';
import { UserModule } from '@user/user.module';
import { UserSchema } from '@schemas/user.schema';
import { User } from '@schemas/user.schema';
import { JwtAccessGuard } from '@auth/guard';
import { ConflictException, ValidationPipe } from '@nestjs/common';
import { UserService } from '@user/user.service';
import {
  followerDtoMock,
  initTestUser1,
  initTestUser2,
  user1,
  user1Modify,
  user2,
} from '@mock/user.mock';
import { importConfigModule } from '@api/modules/Config.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { getUserBasicInfo } from '@user/helper/getUserBasicInfo';
import { ObjectId } from 'bson';

describe('User E2E Test', () => {
  let app, userModel, mongod, user1;
  const jwtMock = { user: { _id: new ObjectId('63734e98384f478a32c3a1cc'), nickname: 'hello' } };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [importConfigModule(), mongoDbServerModule(), importWinstonModule(), UserModule],
    })
      .overrideGuard(JwtAccessGuard)
      .useValue(jwtMock)
      .compile();

    mongod = await moduleRef.get(getConnectionToken());
    userModel = mongod.model(User.name, UserSchema);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  describe('Post /api/user/following/:id', () => {
    beforeEach(async () => {
      user1 = await userModel.create(initTestUser1);
      // jwtMock =
    });

    it('팔로잉 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      console.log(user2);
      await request(app.getHttpServer())
        .post(`/api/user/following/${user2._id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result).toEqual({
            message: '팔로우 신청 완료',
          });
        });
    });

    it('언팔로잉 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      await request(app.getHttpServer()).post(`/api/user/following/${user2._id}`);

      request(app.getHttpServer())
        .post(`/api/user/following/${user2._id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result).toEqual({
            message: '언팔로우 완료',
          });
        });
    });

    // it('팔로우 하지 않았으나 상대방이 팔로우 한 경우 에러', async () => {
    //   jest
    //     .spyOn(userRepository, 'findById')
    //     .mockResolvedValueOnce(user1)
    //     .mockResolvedValueOnce(user2Append);
    //
    //   try {
    //     await userService.toggleFollowing(followerDtoMock);
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(ConflictException);
    //     expect(e.message).toBe('갱신 이상! (팔로우 안되어있으나, 상대방에겐 내가 팔로우됨)');
    //   }
    // });

    // it('팔로우 되어있으나, 상대방에겐 내가 팔로우되어있지 않은 경우 에러', async () => {
    //   jest
    //     .spyOn(userRepository, 'findById')
    //     .mockResolvedValueOnce(user1Append)
    //     .mockResolvedValueOnce(user2);
    //
    //   try {
    //     await userService.toggleFollowing(followerDtoMock);
    //   } catch (e) {
    //     expect(e).toBeInstanceOf(ConflictException);
    //     expect(e.message).toBe(
    //       '갱신 이상! (팔로우 되어있으나, 상대방에겐 내가 팔로우되어있지 않음)',
    //     );
    //   }
    // });
  });

  describe('Get /api/user/followers ', () => {
    it('팔로워 정보 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      return request(app.getHttpServer())
        .get('/api/user/followers')
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result).toEqual([getUserBasicInfo(user1), getUserBasicInfo(user2)]);
        });
    });
  });
  describe('Get /api/users ', () => {
    // it('팔로잉 정상 동작', async () => {
    //   const user2 = await userModel.create(initTestUser2);
    //   return request(app.getHttpServer())
    //     .get('/api/users?search=test')
    //     .expect(200)
    //     .expect((res) => {
    //       expect(res.body.result).toBeDefined();
    //       expect(res.body.result).toEqual([getUserBasicInfo(user1), getUserBasicInfo(user2)]);
    //     });
    // });
  });

  afterEach(async () => {
    // await mongoDbServerCleanup();
    const collections = mongod.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoDbServerStop();
    app.close();
  });
});
