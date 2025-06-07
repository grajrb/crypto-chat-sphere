import Message from './models/Message.js';

export function registerMessageHandlers(io, socket) {  // Join a channel
  socket.on('join_channel', (channelId) => {
    // Leave previous channels
    if (socket.rooms && typeof socket.rooms === 'object') {
      Array.from(socket.rooms).forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    }
    
    // Join new channel
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });
  
  // Send a message
  socket.on('send_message', async (messageData) => {
    try {
      // Create message object
      const messageToSend = {
        id: Date.now().toString(),
        sender: messageData.sender,
        content: messageData.content,
        channelId: messageData.channelId,
        timestamp: new Date().toISOString()
      };
      
      // Try to save to database if MongoDB is connected
      try {
        const message = new Message({
          sender: messageData.sender,
          content: messageData.content,
          channelId: messageData.channelId,
          timestamp: new Date(),
          isMine: false
        });
        
        const savedMessage = await message.save();
        messageToSend.id = savedMessage._id.toString();
      } catch (dbError) {
        console.log('Message not saved to database (MongoDB likely not connected)');
      }
      
      // Broadcast to all users in the channel
      io.to(messageData.channelId).emit('receive_message', messageToSend);
      
      console.log(`Message sent to channel ${messageData.channelId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
}
