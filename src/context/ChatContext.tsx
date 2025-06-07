import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { socket, setupSocketListeners, connectSocket, disconnectSocket, joinChannel, sendSocketMessage } from '../services/socketService';
import { fetchChannels, createNewChannel, fetchMessages, createMessage } from '../services/apiService';
import { useWeb3 } from './Web3Context';
import { toast } from 'sonner';

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

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account } = useWeb3();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize connection to Socket.IO
  useEffect(() => {
    if (account) {
      // Connect to socket server
      connectSocket();

      // Set up socket event listeners
      setupSocketListeners(
        // Handle incoming messages
        (message) => {
          const formattedMessage = {
            id: nanoid(),
            sender: message.sender,
            content: message.content,
            timestamp: new Date(message.timestamp).getTime(),
            isMine: message.sender === account
          };
          
          setMessages(prev => [...prev, formattedMessage]);
        },
        // Handle connection errors
        (error) => {
          toast.error('Connection error', {
            description: 'Failed to connect to chat server'
          });
        }
      );

      return () => {
        // Disconnect from socket when component unmounts
        disconnectSocket();
      };
    }
  }, [account]);

  // Load channels from API
  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        const channelsData = await fetchChannels();
        
        if (channelsData.length > 0) {
          setChannels(channelsData);
          
          // Set first channel as current if none is selected
          if (!currentChannel) {
            setCurrentChannel(channelsData[0]);
          }
        } else {
          // If no channels exist, create default ones
          const general = await createNewChannel('General', 'General discussion');
          setChannels([general]);
          setCurrentChannel(general);
        }
      } catch (error) {
        console.error('Failed to load channels:', error);
        toast.error('Failed to load channels', {
          description: 'Please try again later'
        });
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      loadChannels();
    }
  }, [account]);

  // Load messages when channel changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentChannel) return;
      
      try {
        setLoading(true);
        // Join the socket.io room for this channel
        joinChannel(currentChannel.id);
        
        // Fetch messages for this channel
        const messagesData = await fetchMessages(currentChannel.id);
        
        // Format messages and mark those from current user
        const formattedMessages = messagesData.map(msg => ({
          ...msg,
          isMine: msg.sender === account
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error(`Failed to load messages for channel ${currentChannel.id}:`, error);
        toast.error('Failed to load messages', {
          description: 'Please try again later'
        });
      } finally {
        setLoading(false);
      }
    };

    if (account && currentChannel) {
      loadMessages();
    }
  }, [currentChannel, account]);

  const sendMessage = (content: string) => {
    if (!account || !currentChannel) return;
    
    try {
      // Create a temporary message with local ID
      const tempMessage: Message = {
        id: nanoid(),
        sender: account,
        content,
        timestamp: Date.now(),
        isMine: true
      };
      
      // Add to local state for immediate feedback
      setMessages(prev => [...prev, tempMessage]);
      
      // Send via socket for real-time delivery
      sendSocketMessage({
        sender: account,
        content,
        channelId: currentChannel.id
      });
      
      // Also send via REST API as backup
      createMessage(account, content, currentChannel.id)
        .catch(error => {
          console.error('Error sending message via API:', error);
        });
        
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message', {
        description: 'Please try again'
      });
    }
  };

  const createChannel = async (name: string, description?: string) => {
    if (!account) return;
    
    try {
      setLoading(true);
      const newChannel = await createNewChannel(name, description);
      
      setChannels(prev => [...prev, newChannel]);
      setCurrentChannel(newChannel);
      
      toast.success('Channel created', {
        description: `Channel "${name}" has been created`
      });
    } catch (error) {
      console.error('Failed to create channel:', error);
      toast.error('Failed to create channel', {
        description: 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
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
