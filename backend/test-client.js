const io = require('socket.io-client');

//local development
const SERVER_URL = 'http://localhost:5000';

console.log(`Connecting to ${SERVER_URL}...`);
const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('✅ Connected to server');
  const msg = 'Hello from test-client.js hello hello';
  console.log(`→ Sending message: ${msg}`);
  socket.send(msg);
});

socket.on('message', (data) => {
  console.log(`← Received message: ${data}`);
});

socket.on('disconnect', (reason) => {
  console.log(`❌ Disconnected: ${reason}`);
});

socket.on('connect_error', (err) => {
  console.error('Connect error:', err.message);
});