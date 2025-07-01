import React, { useState, useRef, useEffect } from "react";
import { LogOut, Send, Users, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useChat } from "../context/ChatProvider";
import { cn } from "../lib/utils";

interface ChatRoomProps {
  className?: string;
}

export function ChatRoom({ className }: ChatRoomProps) {
  const { chatState, sendMessage, disconnect } = useChat();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && chatState.messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatState.messages]);

  // Debug log for messages
  useEffect(() => {
    console.log("Messages updated:", chatState.messages);
  }, [chatState.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && chatState.username && chatState.connected) {
      sendMessage(messageInput.trim(), chatState.username);
      setMessageInput("");
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTypeStyles = (type: string) => {
    switch (type) {
      case "system":
        return "text-muted-foreground text-sm italic text-center bg-muted/30 rounded-lg p-2 mx-4";
      case "error":
        return "text-destructive text-sm bg-destructive/10 rounded-lg p-2 mx-4 border border-destructive/20";
      case "user":
        return "bg-background rounded-lg p-3 mx-4 border";
      default:
        return "bg-background rounded-lg p-3 mx-4 border";
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-[600px] w-full max-w-2xl mx-auto",
        className
      )}
    >
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {chatState.userCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {chatState.userCount} online
              </span>
            )}
            <Button onClick={handleDisconnect} variant="outline" className="">
              <LogOut className="h-4 w-4 " />
              <span className="hidden sm:inline-block">Leave Room</span>
            </Button>
          </CardTitle>
          <div className="flex items-center gap-2">
            {chatState.connected ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-destructive">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className=" flex flex-col p-0 h-[600px]">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-0 max-h-[400px] min-h-[400px]">
          <div className="space-y-2 py-4  ">
            {chatState.messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chatState.messages.map((message, index) => {
                const messageKey = `${message.username}-${message.timestamp}-${index}`;

                return (
                  <div
                    key={messageKey}
                    className={getMessageTypeStyles(message.type)}
                  >
                    {message.type !== "system" && (
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-primary">
                          {message.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        message.type === "system" || message.type === "error"
                          ? "text-center"
                          : ""
                      )}
                    >
                      {message.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={
                !chatState.connected
                  ? "Connecting..."
                  : !chatState.inRoom
                  ? "Join a room to chat"
                  : "Type a message..."
              }
              disabled={!chatState.connected || !chatState.inRoom}
              className="flex-1"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              disabled={
                !messageInput.trim() ||
                !chatState.connected ||
                !chatState.inRoom
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {chatState.username && (
            <div className="text-xs text-muted-foreground mt-2">
              Chatting as{" "}
              <span className="font-medium">{chatState.username}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
