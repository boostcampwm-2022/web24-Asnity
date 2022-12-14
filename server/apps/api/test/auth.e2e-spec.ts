import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { mongoDbServerModule } from '@api/modules/mongo-server.module';
import { UserModule } from '@user/user.module';
import { importConfigModule } from '@api/modules/Config.module';
import { importWinstonModule } from '@api/modules/Winstone.module';
import { signoutURL, signupURL, signinURL } from '@api/test/urls/urls';
import { authData } from '@mock/auth.mock';
import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { importRedisModule } from '@api/modules/Redis.module';

describe('Auth E2E Test', () => {
  let app, server;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        importConfigModule(),
        importRedisModule(),
        mongoDbServerModule(),
        importWinstonModule(),
        UserModule,
      ],
      providers: [
        {
          provide: getRedisToken('default'),
          useValue: { get: () => null, set: async () => jest.fn(), del: async () => jest.fn() },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    server = await app.getHttpServer();
  });

  describe('회원가입, 로그인, 로그아웃', () => {
    it('정상 동작', async () => {
      await request(server)
        .post(signupURL)
        .send(authData.signup.requestForm)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body).toEqual(authData.signup.responseForm);
        });

      const accessToken = (
        await request(server)
          .post(signinURL)
          .send(authData.signin.requestForm)
          .expect((res) => {
            expect(res.body).toBeDefined();
            expect(res.body).toEqual(authData.signin.responseForm);
          })
      ).body.accessToken;

      await request(server)
        .post(signoutURL)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          expect(res.body).toEqual(authData.signout.responseForm);
        });
    });
  });
});
