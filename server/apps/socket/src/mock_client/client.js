import { io } from 'socket.io-client';

const port = 8081;
// 형식은 'commu-{community id}'
const helloSocket = io(`http://localhost:${port}/socket/commu-hello`);
// const worldSocket = io(`http://localhost:${port}/socket/commu-world`); // 다른 namesapce

// console.log(helloSocket.connected); // 연결되었는지 true, false로 나옴

// 처음 연결 후 channel 배열을 전달해야함
helloSocket.emit('join', { channels: ['a', 'b', 'c'] });
// worldSocket.emit('join', { channels: ['x', 'y', 'z'] });

// message listen
helloSocket.on('new-message', ({ channelId, message }) => {
  console.log(`new message from server : ${channelId} ${message}`);
});

// message 전송
helloSocket.emit('new-message', { channelId: 'a', message: 'hi i am the first client~' });
