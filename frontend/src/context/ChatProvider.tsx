import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useWebSocket } from '../lib/websocket';
import type { ChatState, Message } from '../lib/websocket';

interface ChatContextValue {
  chatState: ChatState;
  sendMessage: (message: string, username: string) => void;
  joinRoom: (username: string) => void;
  disconnect: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { chatState, sendMessage, joinRoom, disconnect } = useWebSocket();

  

  const contextValue: ChatContextValue = {
    chatState,
    sendMessage,
    joinRoom,
    disconnect,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Export types for consumers
export type { ChatState, Message };
