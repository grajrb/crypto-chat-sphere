import axios from 'axios';
import { Channel, Message } from '@/context/ChatContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Channels
export const fetchChannels = async (): Promise<Channel[]> => {
  try {
    const response = await api.get('/api/channels');
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    // Return default channels if the server is not responding
    return [
      { id: 'general', name: 'General', description: 'General discussion' },
      { id: 'crypto', name: 'Crypto', description: 'Cryptocurrency discussions' },
      { id: 'tech', name: 'Tech', description: 'Technology discussions' }
    ];
  }
};

export const createNewChannel = async (name: string, description?: string): Promise<Channel> => {
  try {
    const response = await api.post('/api/channels', { name, description });
    return response.data;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

// Messages
export const fetchMessages = async (channelId: string): Promise<Message[]> => {
  try {
    const response = await api.get(`/api/messages/${channelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for channel ${channelId}:`, error);
    // Return empty array if the server is not responding
    return [];
  }
};

export const createMessage = async (
  sender: string, 
  content: string, 
  channelId: string
): Promise<Message> => {
  try {
    const response = await api.post('/api/messages', { 
      sender, 
      content, 
      channelId 
    });    return response.data;
  } catch (error) {
    console.error('Error creating message:', error);
    // Return a local message if the server is not responding
    return {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: Date.now(),
      isMine: true
    };
  }
};
