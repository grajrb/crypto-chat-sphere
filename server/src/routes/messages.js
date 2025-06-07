import express from 'express';
import Message from '../models/Message.js';
import { formatMongoDocuments, errorResponse } from '../utils/helpers.js';

const router = express.Router();

// Sample messages if MongoDB is not connected
const SAMPLE_MESSAGES = [
  {
    id: '1',
    sender: '0x1234...5678',
    content: 'Welcome to CryptoChat! This is a demo message.',
    timestamp: Date.now() - 1000 * 60 * 30,
    channelId: 'general'
  }
];

// Get all messages for a specific channel
router.get('/:channelId', async (req, res) => {
  try {
    const messages = await Message.find({ 
      channelId: req.params.channelId 
    }).sort({ timestamp: 1 });
    
    // Format and return the messages
    const formattedMessages = formatMongoDocuments(messages);
    res.json(formattedMessages);
  } catch (error) {
    const response = errorResponse(error, 'Error fetching messages');
    // Return empty array instead of error for better UX
    res.json([]);
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { sender, content, channelId } = req.body;
    
    if (!sender || !content || !channelId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newMessage = new Message({
      sender,
      content,
      channelId,
      timestamp: new Date()
    });
    
    const savedMessage = await newMessage.save();
    
    res.status(201).json({
      id: savedMessage._id.toString(),
      sender: savedMessage.sender,
      content: savedMessage.content,
      timestamp: savedMessage.timestamp.getTime(),
      channelId: savedMessage.channelId
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
