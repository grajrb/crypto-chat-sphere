import express from 'express';
import Channel from '../models/Channel.js';
import { formatMongoDocuments, errorResponse } from '../utils/helpers.js';

const router = express.Router();

// Default channels if MongoDB is not connected
const DEFAULT_CHANNELS = [
  { id: 'general', name: 'General', description: 'General discussion' },
  { id: 'crypto', name: 'Crypto', description: 'Cryptocurrency discussions' },
  { id: 'tech', name: 'Tech', description: 'Technology discussions' }
];

// Get all channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find().sort({ name: 1 });
    
    // Format and return the channels
    const formattedChannels = formatMongoDocuments(channels);
    res.json(formattedChannels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    // Return default channels if MongoDB is not connected
    res.json(DEFAULT_CHANNELS);
  }
});

// Create a new channel
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Channel name is required' });
    }
    
    // Check if channel with this name already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: 'Channel with this name already exists' });
    }
    
    const newChannel = new Channel({
      name,
      description
    });
      const savedChannel = await newChannel.save();
    
    // Format and return the new channel
    res.status(201).json({
      id: savedChannel._id.toString(),
      name: savedChannel.name,
      description: savedChannel.description
    });
  } catch (error) {
    const response = errorResponse(error, 'Error creating channel');
    res.status(500).json(response);
  }
});

export default router;
