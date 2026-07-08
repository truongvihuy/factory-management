import { io, Socket } from 'socket.io-client';

const SERVER = 'http://localhost:3003';

console.log({ SERVER });

const FACTORY = 'F01';

const socket: Socket = io(`${SERVER}/factory`, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('================================');
  console.log('Socket Connected');
  console.log('Socket Id:', socket.id);
  console.log('================================');

  socket.emit('join-factory', FACTORY);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected');
  console.log(reason);
});

socket.on('connect_error', (error) => {
  console.error(error.message);
});

socket.on('telemetry-updated', (payload) => {
  console.log('\n========= TELEMETRY =========');
  console.log(JSON.stringify(payload, null, 2));
});

socket.on('machine-status-updated', (payload) => {
  console.log('\n========= MACHINE =========');
  console.log(JSON.stringify(payload, null, 2));
});

socket.on('device-heartbeat', (payload) => {
  console.log('\n========= HEARTBEAT =========');
  console.log(JSON.stringify(payload, null, 2));
});

socket.on('alarm-created', (payload) => {
  console.log('\n========= ALARM =========');
  console.log(JSON.stringify(payload, null, 2));
});

process.on('SIGINT', () => {
  socket.disconnect();
  process.exit(0);
});
