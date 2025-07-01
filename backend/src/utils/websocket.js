import { WebSocketServer, WebSocket } from "ws";
import ChatController from "../controller/chatController.js";

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();
    this.setupWebsocket();
  }

  setupWebsocket() {
    this.wss.on("connection", (ws, req) => {
      console.log("New client connected :", req.socket.remoteAddress);

      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data);
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error("Error handling message:", error);
          ws.send(
            JSON.stringify({ type: "error", message: "Invalid message format" })
          );
        }
      });
      ws.on("close", () => {
        const clientInfo = this.clients.get(ws);
        if (clientInfo) {
          console.log(`Client disconnected: ${clientInfo.username}`);
          this.clients.delete(ws);

          // Broadcast updated user count to remaining clients
          this.broadcast({
            type: "user_count",
            count: this.clients.size,
          });

          // Broadcast user left message
          this.broadcast({
            type: "user_left",
            username: clientInfo.username,
            timestamp: new Date(),
          });
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    });
  }

  async handleMessage(ws, message) {
    switch (message.type) {
      case "join":
        await this.handleJoin(ws, message);
        break;
      case "chat":
        await this.handleChat(ws, message);
        break;
      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Unknown message type" })
        );
    }
  }

  async handleJoin(ws, message) {
    try {
      const { username } = message;
      if (!username || typeof username !== "string") {
        ws.send(JSON.stringify({ type: "error", message: "Invalid username" }));
        return;
      }

      this.clients.set(ws, {
        username: username.trim(),
        joinedAt: new Date(),
      });

      const recentMessages = await ChatController.getRecentMessages(50);
      ws.send(
        JSON.stringify({
          type: "history",
          messages: recentMessages,
        })
      );

      
      ws.send(
        JSON.stringify({
          type: "system_message",
          message: `Welcome to the chat room, ${username}!`,
          timestamp: new Date(),
        })
      );

      // Send user count to the new user
      ws.send(
        JSON.stringify({
          type: "user_count",
          count: this.clients.size,
        })
      );

      this.broadcast(
        {
          type: "user_joined",
          username,
          timestamp: new Date(),
        },
        ws
      );

      // Broadcast updated user count to all clients
      this.broadcast({
        type: "user_count",
        count: this.clients.size,
      });

      console.log(`Client joined: ${username}`);
    } catch (error) {
      console.error("Error handling join:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Failed to join chat",
        })
      );
    }
  }

  async handleChat(ws, message) {
    try {
      const clientInfo = this.clients.get(ws);
      if (!clientInfo) {
        ws.send(
          JSON.stringify({ type: "error", message: "You must join first" })
        );
        return;
      }
      const { text } = message;
      if (!text || typeof text !== "string") {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid message text" })
        );
        return;
      }

      const savedMessage = await ChatController.saveMessage(
        clientInfo.username,
        text.trim()
      );

      const broadcastMessage = {
        type: "chat",
        username: savedMessage.username,
        message: savedMessage.message,
        timestamp: savedMessage.timestamp,
      };

      this.broadcast(broadcastMessage);
      console.log(`Message from ${clientInfo.username}: ${text}`);
    } catch (error) {
      console.error("Error handling chat message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Failed to send message",
        })
      );
    }
  }

  broadcast(message, excludeWs = null) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
        client.send(JSON.stringify(message));
      }
    });
  }

  getConnectedUserCount() {
    return this.clients.size;
  }

  getConnectedUsers() {
    return Array.from(this.clients.values()).map((client) => client.username);
  }
}

export default WebSocketManager;
