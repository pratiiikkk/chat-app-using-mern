# Chat Application Backend (IDK)

Node.js backend server for the real-time chat application. Provides WebSocket communication, message persistence, and REST API endpoints.

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment**:
   Create a `.env` file:

   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/chatapp
   NODE_ENV=development
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Start production server**:
   ```bash
   npm start
   ```

## 🛠️ Technology Stack

- **Node.js** with Express.js framework
- **WebSocket (ws)** for real-time communication
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection setup
├── controller/          # Business logic controllers
│   └── chatController.js # Chat message operations
├── models/              # Database schemas
│   └── Message.js       # Message model definition
├── utils/               # Utility modules
│   └── websocket.js     # WebSocket server management
└── app.js               # Main application entry point
```

## 🔌 WebSocket Server

The WebSocket server (`WebSocketManager`) handles:

- **Connection Management**: Client connections and disconnections
- **Message Broadcasting**: Real-time message distribution
- **User Tracking**: Connected users count and identification
- **Error Handling**: Connection errors and message validation

### WebSocket Event Flow

```
Client Connect → Join Room → Send/Receive Messages → Disconnect
```

**Incoming Events:**

- `join`: User joins chat with username
- `chat`: User sends a message

**Outgoing Events:**

- `history`: Chat message history on join
- `chat`: Broadcast new messages
- `user_joined`: Notify when user joins
- `user_left`: Notify when user leaves
- `user_count`: Update online users count
- `system_message`: System notifications
- `error`: Error messages

## 🗄️ Database Schema

### Message Model

```javascript
{
  username: String,        // User's display name
  message: String,         // Message content (max 1000 chars)
  timestamp: Date,         // Message creation time
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## 🌐 REST API Endpoints

### Health Check

- **GET** `/health`
  - Returns server health status
  - Response: `"Server is healthy"`

### Chat Information

- **GET** `/chat/info`
  - Returns current chat statistics
  - Response:
    ```json
    {
      "connectedUsers": 5,
      "usernames": ["user1", "user2", "user3", "user4", "user5"]
    }
    ```

## 🔧 Configuration

### Environment Variables

| Variable    | Description               | Default       |
| ----------- | ------------------------- | ------------- |
| `PORT`      | Server port               | `8080`        |
| `MONGO_URI` | MongoDB connection string | Required      |
| `NODE_ENV`  | Environment mode          | `development` |

### MongoDB Setup

**Local MongoDB:**

```env
MONGO_URI=mongodb://localhost:27017/chatapp
```

**MongoDB Atlas:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
```




### Health Monitoring

- Health endpoint for uptime checks
- Connection count tracking
- Error rate monitoring recommended

## 🔄 Message Flow

```
1. Client connects to WebSocket
2. Client sends 'join' event with username
3. Server adds client to active connections
4. Server sends chat history to new client
5. Server broadcasts 'user_joined' to other clients
6. Client sends 'chat' event with message
7. Server saves message to database
8. Server broadcasts message to all connected clients
9. Client disconnects
10. Server removes client and broadcasts 'user_left'
```

