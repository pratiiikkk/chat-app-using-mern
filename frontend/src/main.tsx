import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChatProvider } from "./context/ChatProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <ChatProvider>
    <App />
  </ChatProvider>
);
