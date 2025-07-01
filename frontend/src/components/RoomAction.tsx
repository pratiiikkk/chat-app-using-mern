import React, { useState } from "react";
import { LogIn, LogOut, User, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChat } from "../context/ChatProvider";
import { cn } from "../lib/utils";

interface RoomActionProps {
  className?: string;
}

export function RoomAction({ className }: RoomActionProps) {
  const { chatState, joinRoom, disconnect } = useChat();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    if (username.trim().length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      setError(
        "Username can only contain letters, numbers, hyphens, and underscores"
      );
      return;
    }

    setError("");
    joinRoom(username.trim());
  };

  const handleDisconnect = () => {
    disconnect();
    setUsername("");
    setError("");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {chatState.inRoom ? "Room Status" : "Join Chat Room"}
        </CardTitle>
        <CardDescription>
          {chatState.inRoom
            ? `Connected as ${chatState.username}`
            : "Enter your username to join the conversation"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!chatState.inRoom ? (
          <>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  disabled={!chatState.connected}
                  className={cn(error && "border-destructive")}
                  autoComplete="off"
                  maxLength={20}
                />
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!chatState.connected || !username.trim() || !!error}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {!chatState.connected ? "Connecting..." : "Join Room"}
              </Button>
            </form>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Username must be 2-20 characters</p>
              <p>• Only letters, numbers, hyphens, and underscores allowed</p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">You're in the room!</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Start chatting with other users
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-medium">{chatState.username}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
              {chatState.userCount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Users online:</span>
                  <span className="font-medium">{chatState.userCount}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Room
            </Button>
          </div>
        )}

        {!chatState.connected && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Connecting to server...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
