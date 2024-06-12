import { io } from 'socket.io-client';

const socket = io('https://cv-backend-fscm.onrender.com');
//const socket = io('http://localhost:5000');

export default socket;
