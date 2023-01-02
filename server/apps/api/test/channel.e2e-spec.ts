import { Test, TestingModule } from '@nestjs/testing';
import { importConfigModule } from '@api/modules/Config.module';
import { importRedisModule } from '@api/modules/Redis.module';
import { mongoDbServerModule, mongoDbServerStop } from '@api/modules/mongo-server.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { CommunityModule } from '@community/community.module';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { getConnectionToken } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { Community, CommunitySchema } from '@schemas/community.schema';
import { ApiInterceptor } from '@custom/interceptor/api.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { signupUserRequest } from '@api/test/beforeRequest/signupUser.request';
import { initTestUser1, initTestUser2 } from '@mock/user.mock';
import { signinUserRequest } from '@api/test/beforeRequest/signinUser.request';
import { createCommunityRequest } from '@api/test/beforeRequest/createCommunity.request';
import { communityDto1 } from '@mock/community.mock';
import * as request from 'supertest';
import { createChannelRequest } from '@api/test/beforeRequest/createChannel.request';
import {
  createChannelData,
  getChannelInfoData,
  inviteChannelData,
  joinChannelData,
  modifyChannelData,
} from '@mock/channel.mock';
import { Channel, ChannelSchema } from '@schemas/channel.schema';
import {
  createChannelURL,
  deleteChannelURL,
  exitChannelURL,
  getChannelInfoURL,
  inviteChannelURL,
  joinChannelURL,
  modifyChannelURL,
  updateLastReadURL,
} from '@api/test/urls/urls';

describe('Channel E2E Test', () => {
  let app,
    server,
    userModel,
    communityModel,
    channelModel,
    mongod,
    user1,
    user2,
    communityId,
    channel;
  let accessToken, accessTokenUser2;

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
    channelModel = mongod.model(Channel.name, ChannelSchema);
    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(new ApiInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)));
    await app.init();
  });

  beforeEach(async () => {
    server = await app.getHttpServer();
    await signupUserRequest(server, initTestUser1);
    await signupUserRequest(server, initTestUser2);
    user1 = await userModel.findOne({ id: initTestUser1.id });
    user2 = await userModel.findOne({ id: initTestUser2.id });
    accessToken = await signinUserRequest(server, user1.id, initTestUser1.password);
    accessTokenUser2 = await signinUserRequest(server, user2.id, initTestUser2.password);
    await await createCommunityRequest(server, accessToken, communityDto1);
    communityId = (await communityModel.findOne({ name: communityDto1.name }))._id;

    await request(server)
      .post(`/api/communities/${communityId}/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ users: [user2._id.toString()] });
    await createChannelRequest(server, accessToken, createChannelData.requestForm(communityId));
    channel = await channelModel.findOne({ communityId });
  });

  it('should be defined', () => {
    expect(channelModel).toBeDefined();
  });

  describe('Post /api/channel ', () => {
    it('채널 추가', async () => {
      await request(server)
        .post(createChannelURL)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createChannelData.requestForm(communityId))
        .expect((res) => {
          expect(res.body).toEqual(createChannelData.responseForm);
        });
    });
  });

  describe('Get /api/channels/:channelId', () => {
    it('자신이 속한 채널들의 정보', async () => {
      await request(server)
        .get(getChannelInfoURL(channel._id))
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          res.body.result = JSON.parse(JSON.stringify(res.body.result));
          expect(res.body).toEqual(getChannelInfoData.responseForm(channel));
        });
    });
  });

  describe('Post /api/channels/:channelId/users ', () => {
    it('채널 사용자 초대', async () => {
      await request(server)
        .post(inviteChannelURL(channel._id))
        .set('Authorization', `Bearer ${accessToken}`)
        .send(inviteChannelData.requestForm(communityId, user2._id))
        .expect((res) => {
          res.body.result = JSON.parse(JSON.stringify(res.body.result));
          expect(res.body).toEqual(inviteChannelData.responseForm(channel, user1._id, user2._id));
        });
    });
  });

  describe('POST /api/channels/:channel_id', () => {
    it('채널 참가', async () => {
      await request(server)
        .post(joinChannelURL(channel._id))
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({ community_id: communityId })
        .expect((res) => {
          res.body.result = JSON.parse(JSON.stringify(res.body.result));
          expect(res.body).toEqual(joinChannelData.responseForm(channel, user1._id, user2._id));
        });
    });
  });

  describe('Delete /api/channels/:channelId/me', () => {
    it('채널 퇴장', async () => {
      await request(server)
        .delete(exitChannelURL(channel._id))
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send()
        .expect((res) => {
          expect(res.body.statusCode).toEqual(200);
          expect(res.body.result.message).toEqual('채널 퇴장 성공!');
        });
      const updatedChannel = await channelModel.findById(channel._id);
      expect(updatedChannel.users.includes(user2._id.toString())).toBeFalsy();
    });
  });

  describe('PATCH /api/channels/:channelId/lastRead', () => {
    it('채널 마지막 방문 시간 업데이트', async () => {
      const preUpdateDate = new Date();
      await request(server)
        .patch(updateLastReadURL(channel._id))
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ community_id: communityId })
        .expect((res) => {
          expect(res.body.statusCode).toEqual(200);
        });
      const afterUpdateDate = (await userModel.findById(user1._id)).get(
        `communities.${communityId.toString()}.channels.${channel._id.toString()}`,
      );
      expect(preUpdateDate < afterUpdateDate).toBeTruthy();
    });
  });

  describe('PATCH /api/channels/:channelId/settings', () => {
    it('채널 정보 수정', async () => {
      await request(server)
        .patch(modifyChannelURL(channel._id))
        .set('Authorization', `Bearer ${accessToken}`)
        .send(modifyChannelData.requestForm)
        .expect((res) => {
          expect(res.body.statusCode).toEqual(200);
        });

      const updatedChannel = await channelModel.findById(channel._id);
      expect(updatedChannel.get('description')).toBe('modified');
    });
  });

  describe('Delete /api/channels/:channelId', () => {
    it('채널 삭제', async () => {
      await request(server)
        .delete(deleteChannelURL(channel._id))
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body.statusCode).toEqual(200);
        });

      const deletedChannel = await channelModel.findById(channel._id);
      expect(deletedChannel.get('deletedAt')).toBeDefined();
    });
  });

  afterEach(async () => {
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
