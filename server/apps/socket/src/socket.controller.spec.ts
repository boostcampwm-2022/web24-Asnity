import { Test, TestingModule } from '@nestjs/testing';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';

describe('SocketController', () => {
  let socketController: SocketController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SocketController],
      providers: [SocketService],
    }).compile();

    socketController = app.get<SocketController>(SocketController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(socketController.getHello()).toBe('Hello World!');
    });
  });
});
