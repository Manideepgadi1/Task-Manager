import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: false
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const connectSocket = (userId) => {
  if (socket && !socket.connected) {
    socket.connect();
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
