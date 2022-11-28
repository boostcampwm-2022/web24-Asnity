import { io } from 'socket.io-client';

const port = 8081;
const helloSocket = io(`http://localhost:${port}/socket/commu-hello`);
// const worldSocket = io(`http://localhost:${port}/socket/commu-world`);
console.log(helloSocket.connected);
helloSocket.emit('join', { channels: ['a', 'b', 'c'] });
// worldSocket.emit('join', { channels: ['x', 'y', 'z'] });
helloSocket.on('new-message', ({ channelId, message }) => {
  console.log(`new message from server : ${channelId} ${message}`);
});
helloSocket.emit('new-message', { channelId: 'a', message: 'hi i am the first client~' });
