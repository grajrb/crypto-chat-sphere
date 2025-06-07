// Socket service
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Socket event handlers
// Define a type for chat messages
export type ChatMessage = {
  sender: string;
  content: string;
  channelId: string;
  timestamp?: string;
};

export const setupSocketListeners = (
  onReceiveMessage: (message: ChatMessage) => void,
  onConnectError: (error: Error) => void
) => {
  // Receive a message
  socket.on('receive_message', (message) => {
    onReceiveMessage(message);
  });

  // Connection error
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
    onConnectError(err);
  });

  // Reconnection attempt
  socket.on('reconnect_attempt', (attempt) => {
    console.log(`Socket reconnection attempt ${attempt}`);
  });

  // Successfully reconnected
  socket.on('reconnect', () => {
    console.log('Socket reconnected');
  });
};

// Connect to socket server
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect from socket server
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Join a specific channel
export const joinChannel = (channelId: string) => {
  socket.emit('join_channel', channelId);
};

// Send a message
export const sendSocketMessage = (messageData: {
  sender: string;
  content: string;
  channelId: string;
}) => {
  socket.emit('send_message', messageData);
};
