# Crypto Chat Sphere

Crypto Chat Sphere is a modern Web3 chat application built with cutting-edge technologies to provide a secure, decentralized, and interactive user experience. It combines blockchain wallet authentication with real-time messaging capabilities.

## Project Info

This project is built with:

### Frontend
- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A strongly typed programming language that builds on JavaScript
- **Vite**: A fast build tool for modern web applications
- **shadcn/ui**: A component library for building accessible and customizable UI components
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Socket.IO Client**: For real-time communication with the server
- **Web3 Integration**: Connect with MetaMask or other Ethereum wallets

### Backend
- **Node.js**: JavaScript runtime for building the server
- **Express**: A minimal and flexible Node.js web application framework
- **Socket.IO**: Enables real-time, bidirectional communication
- **MongoDB**: A NoSQL database for storing chat messages and channels
- **Mongoose**: MongoDB object modeling for Node.js

## Features

- **Web3 Authentication**: Connect with your crypto wallet to authenticate
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Persistent Storage**: Messages and channels stored in MongoDB
- **Channel Management**: Create and join different chat channels
- **Responsive Design**: Works on mobile and desktop devices

## Project Structure

```
crypto-chat-sphere/
├── src/                       # Frontend source code
│   ├── components/            # React components
│   │   ├── ChatInterface.tsx  # Main chat interface component
│   │   ├── Sidebar.tsx        # Sidebar with channel list
│   │   └── ui/                # UI components from shadcn/ui
│   ├── context/               # React context providers
│   │   ├── ChatContext.tsx    # Chat state management
│   │   └── Web3Context.tsx    # Web3 wallet connection
│   ├── services/              # API and socket services
│   │   ├── apiService.ts      # HTTP API client
│   │   └── socketService.ts   # Socket.IO client
│   └── pages/                 # Application pages
│       └── Index.tsx          # Main application page
├── server/                    # Backend server code
│   ├── src/                   # Server source code
│   │   ├── models/            # MongoDB models
│   │   │   ├── Channel.js     # Channel schema
│   │   │   └── Message.js     # Message schema
│   │   ├── routes/            # API routes
│   │   │   ├── channels.js    # Channel endpoints
│   │   │   └── messages.js    # Message endpoints
│   │   ├── index.js           # Server entry point
│   │   └── socketHandlers.js  # Socket.IO event handlers
│   └── .env                   # Server environment variables
└── .env                       # Frontend environment variables
```

## How to Run the Project Locally

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```sh
   git clone https://github.com/grajrb/crypto-chat-sphere.git
   ```

2. **Navigate to the project directory**:
   ```sh
   cd crypto-chat-sphere-main
   ```

3. **Install frontend dependencies**:
   ```sh
   npm install
   ```

4. **Install backend dependencies**:
   ```sh
   cd server
   npm install
   cd ..
   ```

5. **Set up MongoDB**:
   
   You'll need MongoDB running locally or a MongoDB Atlas account. Update the MongoDB connection string in `server/.env` file.

   **Using MongoDB Compass:**
   - Install and open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Create a database named `crypto-chat-sphere`
   - Create collections: `channels` and `messages`

6. **Start the backend server**:
   ```sh
   cd server
   node src/index.js
   ```

7. **Start the frontend development server (in a new terminal)**:
   ```sh
   cd crypto-chat-sphere-main
   npm run dev
   ```

8. **Access the application** in your browser at http://localhost:5173

## Setting Up MongoDB

1. **Install MongoDB Compass** from the [official website](https://www.mongodb.com/try/download/compass)
2. **Connect to your local MongoDB instance**:
   - Use the connection string: `mongodb://localhost:27017`
3. **Create the database and collections**:
   - Database name: `crypto-chat-sphere`
   - Collections: `channels` and `messages`

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (server/.env)
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/crypto-chat-sphere
```

## Features to Implement

- [ ] Message encryption for secure communication
- [ ] File sharing capabilities
- [ ] Direct messaging between users
- [ ] Smart contract integration for token-gated channels
- [ ] User profiles with NFT avatars

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on your machine
- Check if the MongoDB connection string is correct in server/.env
- Try connecting with MongoDB Compass to verify the database is accessible

### Socket.IO Connection Issues
- Check browser console for CORS errors
- Verify that both frontend and backend are running
- Ensure the VITE_API_URL is set correctly in the frontend .env file

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact

For questions or feedback, feel free to reach out:

- **Email**: gauravupadhayay9801@gmail.com
- **GitHub**: [grajrb](https://github.com/grajrb)
- **LinkedIn**: [Gaurav Raj](https://www.linkedin.com/in/gaurav-raj-095a8a129/)
