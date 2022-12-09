import { io } from 'socket.io-client';

const port = 8080;
const url = 'http://localhost'; //49.50.167.202';
// 형식은 'commu-{community id}'
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzkwNDVhOWNhYTIwZGVlZmQ1Yzc2NWUiLCJuaWNrbmFtZSI6InNvb21hbiIsImlhdCI6MTY3MDU4NzQ2NywiZXhwIjoxNjcwNTg4MzY3fQ.cmD3b_f5l0IkrNs85XpUzBXRRKEFBVWdkiSB6XxXIXs';
const accessToken2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg0NWNiMTU0NDRmMGEyMGRlNTYxMDUiLCJuaWNrbmFtZSI6InNvb21hbiIsImlhdCI6MTY2OTY1MTM1NywiZXhwIjoxNjY5NjUyMjU3fQ.T3OGoF2hz4ew1iw2c4TA1tldHgTwDxkEyUFBkfUqeHo';
const opt = {
  auth: {
    token: `Bearer ${accessToken}`,
  },
};
try {
  const helloSocket = io(`${url}:${port}/socket/commu-hello`, opt);
  const worldSocket = io(`${url}:${port}/socket/commu-world`, opt); // 다른 namesapce

  // console.log(helloSocket.connected); // 연결되었는지 true, false로 나옴

  // 처음 연결 후 channel 배열을 전달해야함
  const result = helloSocket.emit('join', { channels: ['a', 'b', 'c'] });
  worldSocket.emit('join', { channels: ['x', 'y', 'z'] });

  helloSocket.on('new-message', ({ channelId, user_id, message, time }) => {
    console.log(
      `new message channel : ${channelId}, sender : ${user_id}, msg : [${time}]${message}`,
    );
  });
  worldSocket.on('new-message', ({ channelId, user_id, message, time }) => {
    console.log(`new world channel : ${channelId}, sender : ${user_id}, msg : [${time}]${message}`);
  });
  helloSocket.on('modify-message', ({ channelId, user_id, messageId, message }) => {
    console.log(
      `modify message channel : ${channelId}, sender : ${user_id}, msg(${messageId}) : ${message}`,
    );
  });
  helloSocket.on('connect_error', (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
  });
  helloSocket.on('failed-to-send-message', ({ message }) => {
    console.log('fail error ', message);
  });
  // message 전송
  helloSocket.emit(
    'new-message',
    {
      channelId: '639086392258e789af7d736e',
      user_id: '639045883f4268e12678ef7f',
      message: 'hi its third message',
      time: new Date(),
    },
    (c) => {
      console.log(c.written, ' this is hello');
    },
  );

  worldSocket.emit(
    'new-message',
    {
      channelId: 'x',
      user_id: '639045883f4268e12678ef7f',
      message: 'hi its third message',
      time: new Date(),
    },
    (c) => {
      console.log(c.written, ' this is world');
    },
  );

  helloSocket.emit('modify-message', {
    channelId: '639086392258e789af7d736e',
    user_id: '311',
    messageId: '0a2',
    message: 'hi this is modify message',
  });
} catch (error) {
  console.log(error);
}
