import { useEffect, useState } from "react";
import socket from "./socket";

function App() {
  // Track user input and chat history w/ state variables
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Call param function once on first render
  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage); // Cleanup to avoid duplicates
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div>
      <h1>Chat</h1>
      <div style={{ border: "1px solid #ccc", height: "200px", overflowY: "scroll" }}>
        {messages.map((m, i) => (
          <div key={i}>{m.content || m}</div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
