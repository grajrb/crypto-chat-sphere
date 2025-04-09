
import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  isMine?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  channels: Channel[];
  currentChannel: Channel | null;
  setCurrentChannel: (channel: Channel) => void;
  createChannel: (name: string, description?: string) => void;
  loading: boolean;
}

const DEFAULT_CHANNELS: Channel[] = [
  { id: 'general', name: 'General', description: 'General discussion' },
  { id: 'crypto', name: 'Crypto', description: 'Cryptocurrency discussions' },
  { id: 'tech', name: 'Tech', description: 'Technology discussions' }
];

// Sample messages for demonstration
const SAMPLE_MESSAGES: Message[] = [
  {
    id: nanoid(),
    sender: '0x1234...5678',
    content: 'Hey everyone, welcome to CryptoChat!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: nanoid(),
    sender: '0x8765...4321',
    content: 'This is awesome! I love the Web3 integration.',
    timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
  },
  {
    id: nanoid(),
    sender: '0x9876...3210',
    content: 'Has anyone tried using smart contracts for messaging yet?',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  }
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(DEFAULT_CHANNELS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading messages from a server
    const timer = setTimeout(() => {
      setMessages(SAMPLE_MESSAGES);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: nanoid(),
      sender: '0xYou',
      content,
      timestamp: Date.now(),
      isMine: true
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const createChannel = (name: string, description?: string) => {
    const newChannel: Channel = {
      id: nanoid(),
      name,
      description
    };
    
    setChannels(prev => [...prev, newChannel]);
    setCurrentChannel(newChannel);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        sendMessage,
        channels,
        currentChannel,
        setCurrentChannel,
        createChannel,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
