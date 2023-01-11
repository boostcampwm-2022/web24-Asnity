import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { mongoDbServerModule, mongoDbServerStop } from '@api/modules/mongo-server.module';
import { UserModule } from '@user/user.module';
import { UserSchema } from '@schemas/user.schema';
import { User } from '@schemas/user.schema';
import { ValidationPipe } from '@nestjs/common';
import { initTestUser1, initTestUser2 } from '@mock/user.mock';
import { importConfigModule } from '@api/modules/Config.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { followingURL, signupURL, signinURL } from '@api/test/urls/urls';
import { CommunityModule } from '@community/community.module';
import { Community, CommunitySchema } from '@schemas/community.schema';
import { communityDto1, communityDto2, modifyCommunityDto1 } from '@mock/community.mock';
import { ApiInterceptor } from '@custom/interceptor/api.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { importRedisModule } from '@api/modules/Redis.module';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { createCommunityRequest } from '@api/test/beforeRequest/createCommunity.request';
import { signupUserRequest } from '@api/test/beforeRequest/signupUser.request';
import { signinUserRequest } from '@api/test/beforeRequest/signinUser.request';

describe('Community E2E Test', () => {
  let app, server, userModel, communityModel, mongod, user1;
  let accessToken;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        importConfigModule(),
        importRedisModule(),
        mongoDbServerModule(),
        importWinstonModule(),
        CommunityModule,
      ],
      providers: [
        {
          provide: getRedisToken('default'),
          useValue: { get: () => null, set: async () => jest.fn(), del: async () => jest.fn() },
        },
      ],
    }).compile();

    mongod = await moduleRef.get(getConnectionToken());
    userModel = mongod.model(User.name, UserSchema);
    communityModel = mongod.model(Community.name, CommunitySchema);
    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(new ApiInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)));
    await app.init();
  });

  beforeEach(async () => {
    server = await app.getHttpServer();
    await signupUserRequest(server, initTestUser1);
    user1 = await userModel.findOne({ id: initTestUser1.id });
    accessToken = await signinUserRequest(server, user1.id, initTestUser1.password);
    await createCommunityRequest(server, accessToken, communityDto1);
  });

  it('should be defined', () => {
    expect(communityModel).toBeDefined();
  });

  describe('Post /api/community ', () => {
    it('커뮤니티 추가', async () => {
      await request(server)
        .post(`/api/community`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(communityDto2)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result.name).toEqual(communityDto2.name);
        });
    });
  });

  describe('Get /api/communities', () => {
    it('자신이 속한 커뮤니티들의 정보', async () => {
      await createCommunityRequest(server, accessToken, communityDto2);

      await request(server)
        .get(`/api/communities`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.result.communities).toBeDefined();
          expect(res.body.result.communities.length).toEqual(2);
          expect(res.body.result.communities[0].managerId).toEqual(user1._id.toString());
          expect(res.body.result.communities[0].name).toEqual(communityDto1.name);
          expect(res.body.result.communities[1].managerId).toEqual(user1._id.toString());
          expect(res.body.result.communities[1].name).toEqual(communityDto2.name);
        });
    });
  });

  describe('Post /api/communities/:id/users ', () => {
    it('커뮤니티 사용자 추가', async () => {
      const user2 = await userModel.create(initTestUser2);

      const community = await communityModel.findOne({ name: communityDto1.name });
      await request(server)
        .post(`/api/communities/${community._id}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ community_id: community._id, requestUserId: user1._id, users: [user2._id] })
        .expect((res) => {
          expect(res.body.result.message).toEqual('커뮤니티 사용자 추가 완료');
        });
      const updatedCommunity = await communityModel.findById(community._id);
      expect(updatedCommunity.users).toContain(user2._id.toString());
    });
  });

  describe('Delete /api/communities/:id', () => {
    it('커뮤니티들 삭제', async () => {
      const community = await communityModel.findOne({ name: communityDto1.name });
      await request(server)
        .delete(`/api/communities/${community._id.toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(communityDto1)
        .expect((res) => {
          expect(res.body.result.message).toEqual('커뮤니티 삭제 성공');
        });

      const updatedCommunity = await communityModel.findOne({ _id: community._id });
      expect(community.deletedAt).toBeUndefined();
      expect(updatedCommunity.deletedAt).toBeDefined();
    });
  });

  describe('Get /api/communities/:id/users ', () => {
    it('커뮤니티 사용자 정보 전달', async () => {
      const user2 = await userModel.create(initTestUser2);

      const community = await communityModel.findOne({ name: communityDto1.name });
      await request(server)
        .post(`/api/communities/${community._id.toString()}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ community_id: community._id, requestUserId: user1._id, users: [user2._id] });

      await request(server)
        .get(`/api/communities/${community._id.toString()}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.result).toBeDefined();
          expect(res.body.result.users[1]).toHaveProperty('_id', user2._id.toString());
        });
    });
  });

  describe('Delete /api/communities/:id/me ', () => {
    it('커뮤니티 퇴장', async () => {
      let user2;
      await signupUserRequest(server, initTestUser2).then(async () => {
        user2 = await userModel.findOne({ id: initTestUser2.id });
      });
      const user2AccessToken = await signinUserRequest(server, user2.id, initTestUser2.password);
      const community = await communityModel.findOne({ name: communityDto1.name });
      await request(server)
        .post(`/api/communities/${community._id.toString()}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          community_id: community._id.toString(),
          requestUserId: user1._id.toString(),
          users: [user2._id],
        });
      await request(server)
        .delete(`/api/communities/${community._id.toString()}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.message).toEqual(
            '매니저는 커뮤니티에서 탈퇴할 수 없습니다. 매니저 위임하세요.',
          );
          expect(res.body.error).toBeDefined();
        });

      await request(server)
        .delete(`/api/communities/${community._id.toString()}/me`)
        .set('Authorization', `Bearer ${user2AccessToken}`)
        .expect((res) => {
          expect(res.body.result.message).toEqual('사용자 커뮤니티 탈퇴 성공');
        });
      const updatedCommunity = await communityModel.findOne({ name: communityDto1.name });
      expect(updatedCommunity.users.length).toEqual(1);
    });
  });

  describe('Patch /api/communities/:id/settings ', () => {
    it('커뮤니티 정보 수', async () => {
      const user2 = await userModel.create(initTestUser2);

      const community = await communityModel.findOne({ name: communityDto1.name });

      await request(server)
        .patch(`/api/communities/${community._id.toString()}/settings`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(modifyCommunityDto1)
        .expect((res) => {
          expect(res.body.result.message).toEqual('커뮤니티 정보 수정 완료');
        });

      const updatedCommunity = await communityModel.findById(community._id);
      expect(updatedCommunity.description).toEqual(modifyCommunityDto1.description);
      expect(updatedCommunity.name).toEqual(modifyCommunityDto1.name);
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
    await mongoDbServerStop();
    app.close();
  });
});
