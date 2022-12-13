import { io } from 'socket.io-client';

const port = 8080;
const url = 'http://localhost';
// 형식은 'commu-{community id}'
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzk0YzJlNGQxYTYxNWJmNTY0ZDVhY2YiLCJuaWNrbmFtZSI6Im5heW91bmciLCJpYXQiOjE2NzA4NDQyNDMsImV4cCI6MTY3MDg0NTE0M30.frX2jym5MdNPbmTD3c9xUeH38WbXArfY2SX-NVZlEzQ';

const opt = {
  auth: {
    token: `Bearer ${accessToken}`,
  },
};
try {
  const helloSocket = io(`${url}:${port}/socket/commu-63956c42d1a615bf564e3af6`, opt);
  // const worldSocket = io(`${url}:${port}/socket/commu-world`, opt); // 다른 namesapce

  // console.log(helloSocket.connected); // 연결되었는지 true, false로 나옴

  // 처음 연결 후 channel 배열을 전달해야함
  const result = helloSocket.emit('join', { channels: ['63956c5cd1a615bf564e3afe', 'b', 'c'] });
  // worldSocket.emit('join', { channels: ['x', 'y', 'z'] });

  helloSocket.on('new-chat', (data) => {
    console.log(`new message channel : ${JSON.stringify(data)}`);
  });
  // worldSocket.on('new-chat', (data) => {
  //   console.log(`new world channel : ${JSON.stringify(data)}`);
  // });

  helloSocket.on('modify-chat', (data) => {
    console.log(`modify message channel : ${JSON.stringify(data)}`);
  });

  helloSocket.on('connect_error', (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
  });
  helloSocket.on('failed-to-send-message', ({ message }) => {
    console.log('fail error ', message);
  });
  // message 전송
  // helloSocket.emit(
  //   'chat',
  //   {
  //     chatType: 'new',
  //     channelId: '63956c5cd1a615bf564e3afe',
  //     content: '화요일 좋아',
  //   },
  //   (c) => {
  //     console.log(c.written, ' this is hello ', JSON.stringify(c.chatInfo));
  //   },
  // );

  // worldSocket.emit(
  //   'message',
  //   {
  //     type: 'new',
  //     channelId: 'x',
  //     content: 'hi its third message',
  //   },
  //   (c) => {
  //     console.log(c.written, ' this is world', JSON.stringify(c.chatInfo));
  //   },
  // );

  helloSocket.emit(
    'chat',
    {
      chatType: 'modify',
      channelId: '63956c5cd1a615bf564e3afe',
      chatId: '6',
      content: '맞앙, 화요일 싫어',
    },
    (c) => {
      console.log(c.written, ' modify done');
    },
  );
} catch (error) {
  console.log(error);
}
