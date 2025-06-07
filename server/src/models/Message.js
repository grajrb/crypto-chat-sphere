import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  channelId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isMine: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
