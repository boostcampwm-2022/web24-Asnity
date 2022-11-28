import { io } from 'socket.io-client';

const port = 8081;
const helloSocket = io(`http://localhost:${port}/commu-hello`);
const worldSocket = io(`http://localhost:${port}/commu-world`);
console.log(helloSocket.connected);
helloSocket.emit('join', { channel: ['a', 'b', 'c'] });
worldSocket.emit('join', { channel: ['x', 'y', 'z'] });
helloSocket.on('new-message', ({ message }) => {
  console.log(`new message from server : ${message}`);
});
helloSocket.emit('new-message', { message: 'hi i am the first client~' });
