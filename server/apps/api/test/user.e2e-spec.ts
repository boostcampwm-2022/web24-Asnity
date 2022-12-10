import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { mongoDbServerModule, mongoDbServerStop } from '@api/modules/mongo-server.module';
import { UserModule } from '@user/user.module';
import { UserSchema } from '@schemas/user.schema';
import { User } from '@schemas/user.schema';
import { ValidationPipe } from '@nestjs/common';
import { initTestUser1, initTestUser2, user1Modify } from '@mock/user.mock';
import { importConfigModule } from '@api/modules/Config.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { followingURL, signupURL, singinURL } from '@api/test/urls/urls';

describe('User E2E Test', () => {
  let app, server, userModel, mongod, user1;
  let accessToken;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [importConfigModule(), mongoDbServerModule(), importWinstonModule(), UserModule],
    }).compile();

    mongod = await moduleRef.get(getConnectionToken());
    userModel = mongod.model(User.name, UserSchema);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    server = await app.getHttpServer();
    await request(server)
      .post(signupURL)
      .send({
        id: initTestUser1.id,
        password: initTestUser1.password,
        nickname: initTestUser1.nickname,
      })
      .then(async () => {
        user1 = await userModel.findOne({ id: initTestUser1.id });
      });
    accessToken = (
      await request(server).post(singinURL).send({ id: user1.id, password: initTestUser1.password })
    ).body.result.accessToken;
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  describe('Post /api/user/following/:id', () => {
    it('팔로잉 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      await request(server)
        .post(`${followingURL}/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result).toEqual({
            message: '팔로우 신청 완료',
          });
        });
    });

    it('언팔로잉 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      await request(server)
        .post(`${followingURL}/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      await request(server)
        .post(`/api/user/following/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result).toEqual({
            message: '언팔로우 완료',
          });
        });
    });
  });

  describe('Get /api/user/followers ', () => {
    it('팔로워 정보 정상 동작', async () => {
      let user2;
      await request(server)
        .post(signupURL)
        .send({
          id: initTestUser2.id,
          password: initTestUser2.password,
          nickname: initTestUser2.nickname,
        })
        .then(async () => {
          user2 = await userModel.findOne({ id: initTestUser2.id });
        });
      const user2AccessToken = (
        await request(server)
          .post(singinURL)
          .send({ id: user2.id, password: initTestUser2.password })
      ).body.result.accessToken;

      await request(server)
        .post(`${followingURL}/${user1._id}`)
        .set('Authorization', `Bearer ${user2AccessToken}`);

      await request(server)
        .get('/api/user/followers')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.result.followers).toBeDefined();
          expect(res.body.result.followers[0]['_id']).toEqual(user2._id.toString());
        });
    });
  });

  describe('Get /api/user/followings ', () => {
    it('팔로워 정보 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      await request(server)
        .post(`${followingURL}/${user2._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      await request(server)
        .get('/api/user/followings')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.result.followings).toBeDefined();
          expect(res.body.result.followings[0]['_id']).toEqual(user2._id.toString());
        });
    });
  });

  describe('Patch /api/user/settings ', () => {
    it('팔로워 정보 정상 동작', async () => {
      await request(server)
        .patch('/api/user/settings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(user1Modify)
        .expect(200)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result.message).toEqual('사용자 정보 변경 완료');
        });
      const newUser1 = await userModel.findById(user1._id);
      expect(newUser1.description).toEqual(user1Modify.description);
    });
  });

  describe('Get /api/users ', () => {
    it('사용자 검색 정상 동작', async () => {
      const user2 = await userModel.create(initTestUser2);
      return request(server)
        .get('/api/users?search=test')
        .expect(200)
        .expect((res) => {
          expect(res.body.result.users).toBeDefined();
          expect(res.body.result.users.length).toEqual(2);
        });
    });
  });

  afterEach(async () => {
    // await mongoDbServerCleanup();
    server.close();
    const collections = mongod.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await mongoDbServerStop();
  });
});
