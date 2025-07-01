import { useCallback, useEffect, useRef, useState } from "react";

export interface Message {
  type: string;
  message: string;
  timestamp: number;
  username?: string;
}

export interface IncomingMessage {
  type:
    | "user_joined"
    | "user_left"
    | "user_count"
    | "system_message"
    | "error"
    | "chat"
    | "history";
  username?: string;
  text?: string;
  message?: string;
  messages?: Message[];
  count?: number;
  timestamp: number;
}

export interface OutgoingMessage {
  type: "chat" | "join";
  text?: string;
  username: string;
}

export interface ChatState {
  connected: boolean;
  userCount: number;
  messages: Message[] ;
  inRoom: boolean;
  username: string | null;
}

export function useWebSocket() {
  const [chatState, setChatState] = useState<ChatState>({
    connected: false,
    userCount: 0,
    messages: [],
    inRoom: false,
    username: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080";

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setChatState((prev) => ({
          ...prev,
          connected: true,
        }));
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const message: IncomingMessage = JSON.parse(event.data);
          handleIncomingMessage(message);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setChatState((prev) => ({ ...prev, connected: false }));
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`
          );

          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, Math.pow(2, reconnectAttempts.current) * 1000); //  backoff
        } else {
          console.log("Max reconnection attempts reached");
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }, []);

  const handleIncomingMessage = useCallback((message: IncomingMessage) => {
    switch (message.type) {
      case "user_joined":
        if (message.username) {
          const systemMessage: Message = {
            type: "system",
            message: `${message.username} joined the room`,
            username: "system",
            timestamp: Date.now(),
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, systemMessage],
          }));
        }
        break;

      case "user_left":
        if (message.username) {
          const systemMessage: Message = {
            type: "system",
            message: `${message.username} left the room`,
            username: "system",
            timestamp: Date.now(),
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, systemMessage],
          }));
        }
        break;

      case "user_count":
        setChatState((prev) => ({
          ...prev,
          userCount: message.count || 0,
        }));
        break;

      case "system_message":
        if (message.message) {
          const systemMessage: Message = {
            type: "system",
            message: message.message,
            username: "system",
            timestamp:
              typeof message.timestamp === "string"
                ? new Date(message.timestamp).getTime()
                : message.timestamp,
          };

          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, systemMessage],
          }));
        }
        break;

      case "chat":
        console.log("Received chat message:", message);
        // Handle both 'text' and 'message' fields for compatibility
        const messageText = message.text || message.message;
        if (messageText) {
          setChatState((prev) => {
          

            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  type: "user",
                  message: messageText,
                  timestamp: message.timestamp,
                  username: message.username,
                },
              ],
            };
          });
        }
        break;

      case "history":
        console.log("Received history:", message);
        if (message.messages) {
       
          
       
          setChatState((prev) => ({
            ...prev,
            messages: message.messages || []
          }));
        
        } else if (message.text) {
          // Fallback for stringified format
          try {
            const historyMessages: Message[] = JSON.parse(message.text);
            setChatState((prev) => ({
              ...prev,
              messages: historyMessages,
            }));
          } catch (error) {
            console.error("Error parsing history messages:", error);
          }
        }
        break;

      case "error":
        setChatState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: "error",
              message: message.text || "An error occurred",
              timestamp: message.timestamp,
            },
          ],
        }));
        break;

      default:
        console.warn("Unknown message type:", message.type);
        break;
    }
  }, []);

  const sendMessage = useCallback((outgoingMessage: OutgoingMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(outgoingMessage));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  }, []);

  const sendChatMessage = useCallback(
    (message: string, username: string) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        

        // Send to server
        sendMessage({
          type: "chat",
          text: message,
          username,
        });
      } else {
        console.warn("WebSocket is not open. Cannot send message.");
      }
    },
    [sendMessage]
  );

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setChatState((prev) => ({
        ...prev,
        connected: false,
        inRoom: false,
        messages: [], 
        username: null,
      }));
    }
  }, []);

  const joinRoom = useCallback(
    (username: string) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const joinMessage: OutgoingMessage = {
          type: "join",
          username,
        };
        sendMessage(joinMessage);
        setChatState((prev) => ({
          ...prev,
          username,
          inRoom: true,
        }));
      } else {
        console.warn("WebSocket is not open. Cannot join room.");
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  return {
    chatState,
    sendMessage: sendChatMessage,
    disconnect,
    joinRoom,
  };
}
