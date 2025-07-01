# Chat Application Frontend (CFE)

Real-time chat application frontend built with React, TypeScript, and Vite. Features modern UI components, WebSocket integration, and responsive design.

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment**:
   Create a `.env` file:

   ```env
   VITE_WS_URL=ws://localhost:8080
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```


## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Button, Card, Input, etc.)
│   ├── ChatRoom.tsx     # Main chat interface
│   └── RoomAction.tsx   # Join room component
├── context/             # React context providers
│   └── ChatProvider.tsx # Chat state management
├── lib/                 # Utilities and hooks
│   ├── websocket.ts     # WebSocket client logic
│   └── utils.ts         # Helper functions
├── assets/              # Static assets
├── App.tsx              # Main application component
├── main.tsx             # Entry point
└── index.css            # Global styles
```



## 🎨 UI Components

Built with Radix UI primitives and styled with Tailwind CSS:

- **Button**: Various sizes and variants
- **Card**: Container components for chat messages
- **Input**: Text input for messages and username
- **ScrollArea**: Smooth scrolling chat history

## 🔧 Configuration

### Environment Variables

- `VITE_WS_URL`: WebSocket server URL (default: `ws://localhost:8080`)



For complete setup instructions and backend integration, see the main [README.md](../README.md) in the root directory.

