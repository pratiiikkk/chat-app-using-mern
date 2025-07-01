import { Message } from "../models/Message.js";

class ChatController {
  static async saveMessage(username, message) {
    try {
      const newMessage = new Message({
        username,
        message,
        timestamp: new Date(),
      });

      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error("Error saving message:", error);
      throw new Error("Failed to save message");
    }
  }
  static async getRecentMessages(limit = 50) {
    try {
      const messages = await Message.find()
        .sort({ timestamp: -1 }) 
        .limit(limit)
        .select("username message timestamp")
        .lean(); //plain js object

      return messages.reverse(); // Reverse to show oldest first in chat
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

export default ChatController;
