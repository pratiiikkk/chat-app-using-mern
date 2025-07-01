# Real-Time Chat Application

A modern, real-time chat application built with React (TypeScript) frontend and Node.js backend, featuring WebSocket communication for instant messaging.

## 🌍 Deployed Application

The chat application is live and accessible at:

**🔗 Application frontend URL**: https://chatty.pratiik.me/

**🔗 Application Server URL**: https://chat.pratiik.me/

**⚡ WebSocket Endpoint**: wss://chat.pratiik.me/ws

You can access the deployed application directly in your browser without any setup. Simply visit the URL above and start chatting!

### For Development Against Production Backend

If you want to run the frontend locally but connect to the production backend:

1. **Frontend Environment Configuration**:
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_WS_URL=wss://chat.pratiik.me/ws
   ```

2. **Start local development**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🏗️ Architecture Overview

### Frontend (React + TypeScript + Vite)

- **Location**: `/frontend` directory
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom UI components
- **State Management**: React Context API for chat state
- **WebSocket Client**: Custom hook (`useWebSocket`) for real-time communication

### Backend (Node.js + Express)

- **Location**: `/backend` directory
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **WebSocket Server**: ws library for WebSocket connections
- **Architecture Pattern**: MVC (Model-View-Controller)

### Communication Flow

```
Client (React) ←→ WebSocket ←→ Server (Node.js) ←→ MongoDB
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)

### Backend Setup

1. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `backend` directory:

   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/chatapp
   # Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chatapp
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_WS_URL=ws://localhost:8080
   # For development against local backend

   # For development against production backend:
   # VITE_WS_URL=wss://chat.pratiik.me/ws

   # For your own production deployment:
   # VITE_WS_URL=wss://your-backend-domain.com/ws
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Building for Production

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

## 🌐 Concurrency Handling

### WebSocket Connection Management

- **Client-side**: Automatic reconnection with exponential backoff strategy
- **Server-side**: Concurrent connection handling using Node.js event loop
- **Message Broadcasting**: Efficient message distribution to all connected clients
- **Connection State**: Proper cleanup on client disconnect

### Database Operations

- **Mongoose Connection Pooling**: Handles multiple concurrent database operations
- **Message Persistence**: Asynchronous save operations with error handling
- **Query Optimization**: Efficient retrieval of recent messages with sorting and limiting

### Frontend State Management

- **React Context**: Centralized chat state management
- **WebSocket Hook**: Custom hook managing connection lifecycle
- **Message Queue**: Proper message ordering and state updates
- **Error Boundaries**: Graceful error handling and user feedback

### Environment Variables for Production

**Backend (.env)**:

```env
PORT=8080
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
NODE_ENV=production
```

**Frontend (.env)**:

```env
VITE_WS_URL=wss://chat.pratiik.me/ws
# Or for your own deployment: wss://your-backend-domain.com/ws
```

## 📁 Project Structure

```
├── frontend/                          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── ChatRoom.tsx     # Main chat interface
│   │   │   └── RoomAction.tsx   # Join room component
│   │   ├── context/             # React context providers
│   │   │   └── ChatProvider.tsx # Chat state management
│   │   ├── lib/                 # Utilities and hooks
│   │   │   ├── websocket.ts     # WebSocket client logic
│   │   │   └── utils.ts         # Helper functions
│   │   └── App.tsx              # Main application component
│   ├── package.json
│   └── vite.config.ts           # Vite configuration
│
├── backend/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   └── database.js      # Database connection
│   │   ├── controller/          # Business logic
│   │   │   └── chatController.js # Chat operations
│   │   ├── models/              # Database models
│   │   │   └── Message.js       # Message schema
│   │   ├── utils/               # Utilities
│   │   │   └── websocket.js     # WebSocket server logic
│   │   └── app.js               # Main application file
│   └── package.json
│
└── README.md                     # This file
```

## 🔗 API Endpoints

### REST Endpoints

- `GET /health` - Health check endpoint
- `GET /chat/info` - Get connected users count and usernames

### WebSocket Events

**Client to Server:**

- `join` - Join the chat room with username
- `chat` - Send a chat message

**Server to Client:**

- `history` - Chat history on join
- `chat` - New chat message
- `user_joined` - User joined notification
- `user_left` - User left notification
- `user_count` - Updated user count
- `system_message` - System notifications
- `error` - Error messages
