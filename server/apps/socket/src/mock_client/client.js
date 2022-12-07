import { io } from 'socket.io-client';

const port = 8080;
// 형식은 'commu-{community id}'
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzkwNDU4ODNmNDI2OGUxMjY3OGVmN2YiLCJuaWNrbmFtZSI6Im55IiwiaWF0IjoxNjcwNDA5MDQ0LCJleHAiOjE2NzA0MDk5NDR9.939Xi2pgHPi8Sm75PKw887g6EXmgzPgWTpFrTgZIgBU';
const accessToken2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg0NWNiMTU0NDRmMGEyMGRlNTYxMDUiLCJuaWNrbmFtZSI6InNvb21hbiIsImlhdCI6MTY2OTY1MTM1NywiZXhwIjoxNjY5NjUyMjU3fQ.T3OGoF2hz4ew1iw2c4TA1tldHgTwDxkEyUFBkfUqeHo';
const opt = {
  auth: {
    token: `Bearer ${accessToken2}`,
  },
};
try {
  const helloSocket = io(`http://localhost:${port}/socket/commu-hello`, opt);
  // const worldSocket = io(`http://localhost:${port}/socket/commu-world`); // 다른 namesapce

  // console.log(helloSocket.connected); // 연결되었는지 true, false로 나옴

  // 처음 연결 후 channel 배열을 전달해야함
  const result = helloSocket.emit('join', { channels: ['a', 'b', 'c'] });
  // worldSocket.emit('join', { channels: ['x', 'y', 'z'] });
  // console.log(result);
  // console.log(helloSocket);
  // message listen
  helloSocket.on('new-message', ({ channelId, user_id, message, time }) => {
    console.log(
      `new message channel : ${channelId}, sender : ${user_id}, msg : [${time}]${message}`,
    );
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
    console.log(message);
  });
  // message 전송
  helloSocket.emit('new-message', {
    channelId: 'a',
    user_id: '311',
    message: 'hi i am the first client~',
    time: new Date(),
  });

  helloSocket.emit('modify-message', {
    channelId: 'a',
    user_id: '311',
    messageId: '0a2',
    message: 'hi this is modify message',
  });
} catch (error) {
  console.log(error);
}
