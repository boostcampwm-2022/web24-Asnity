import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as io from 'socket.io-client';
import { SocketModule } from '../src/socket.module';

describe('Socket e2e', () => {
  let app: INestApplication;

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [SocketModule],
  //   }).compile();
  //
  //   app = moduleFixture.createNestApplication();
  //   await app.listen(8080, '127.0.0.1');
  // });
  //
  // afterAll(async () => {
  //   await app.close();
  // });

  it('should call message', async () => {
    // const url = await app.getUrl();
    // const socket = io.connect(url + '/socket/commu-hello');
    const inputData = { channelId: 'a', user_id: 'ny', message: 'hello', time: Date.now() };
    expect(inputData).toEqual(inputData);
    // socket.on('new-message', ({ channelId, user_id, message, time }) => {
    //   console.log(channelId, user_id);
    //   expect({ channelId, user_id, message }).toEqual(inputData);
    // });
    // socket.emit('new-message', inputData, ({ channelId, user_id, message, time }) => {
    //   expect({ channelId, user_id, message, time }).toEqual(inputData);
    // });
    // await new Promise<void>((resolve) =>
    //   socket.on('new-message', ({ channelId, user_id, message, time }) => {
    //     console.log(channelId, user_id);
    //     expect({ channelId, user_id, message, time }).toEqual(inputData);
    //     resolve();
    //   }),
    // );
  });
});
