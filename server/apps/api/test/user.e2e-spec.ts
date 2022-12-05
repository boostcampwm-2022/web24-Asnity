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
import { ValidationPipe } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { followerDtoMock, user1, user2 } from '@mock/user.mock';
import { importConfigModule } from '@api/modules/Config.module';
import { importWinstonModule } from '@api/modules/Winstone.module';

describe('User E2E Test', () => {
  let app;
  let userModel;
  let mongod;
  let userService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [importConfigModule(), mongoDbServerModule(), importWinstonModule(), UserModule],
    })
      .overrideGuard(JwtAccessGuard)
      .useValue({})
      .compile();

    mongod = await moduleRef.get(getConnectionToken());
    userModel = mongod.model(User.name, UserSchema);
    userService = moduleRef.get(UserService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('팔로잉 정상 동작', async () => {
    const user1M = await userModel.create(user1);
    const user2M = await userModel.create(user2);
    const result = await userService.toggleFollowing({ myId: user1M._id, followId: user2M._id });
    expect(result).toEqual({
      message: '팔로우 신청 완료',
    });
  });
  it('GET /users', async () => {
    const user1M = await userModel.create(user1);
    const user2M = await userModel.create(user2);
    return request(app.getHttpServer())
      .get('/api/users?search=test')
      .expect(200)
      .expect((res) => {
        expect(res.body.result).toBeDefined();
        expect(res.body.result).toHaveProperty('users');
      });
  });

  it('guart test ', async () => {
    const user2M = await userModel.create(user2);
    return request(app.getHttpServer())
      .get('/api/user/followers')
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        expect(res.body.result).toBeDefined();
        // expect(res.body.result).toHaveProperty('users');
      });
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
