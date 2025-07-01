import { Github } from "lucide-react";
import { ChatRoom } from "./components/ChatRoom";
import { RoomAction } from "./components/RoomAction";
import { Button } from "./components/ui/button";
import { useChat } from "./context/ChatProvider";

function App() {
  const { chatState } = useChat();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Chat Rooms
          </h1>
          <p className="text-muted-foreground">
            Connect and chat with others in real-time
          </p>
        </div>

        <div className="flex flex-col   max-w-6xl mx-auto">
          {chatState.inRoom ? <ChatRoom /> : <RoomAction />}
        </div>

        <footer className="text-center mt-12 pt-8 ">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <p>Made with ❤️</p>
            <Button
              size="sm"
              variant="ghost"
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
              asChild
            >
              <a
                href="https://github.com/pratiiikkk/chat-rooms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
