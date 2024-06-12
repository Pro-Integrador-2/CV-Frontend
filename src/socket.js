import { io } from 'socket.io-client';

const socket = io('https://cv-backend-fscm.onrender.com');

export default socket;