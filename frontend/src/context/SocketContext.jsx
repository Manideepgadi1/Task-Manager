import React, { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { initializeSocket, connectSocket, disconnectSocket, getSocket } from '../utils/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const socket = initializeSocket();

    if (isAuthenticated && user) {
      connectSocket(user.id);

      // Listen for notifications
      socket.on('notification', (notification) => {
        // Show toast notification
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000
        });
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket: getSocket()
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
