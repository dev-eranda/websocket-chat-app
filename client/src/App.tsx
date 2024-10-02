import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onopen = () => {
      console.log("Connected to the server");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("Received a message from the server");

      // Check if event.data is a Blob and convert it to text
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          setMessages((prev) => [...prev, text]);
        };
        reader.readAsText(event.data);
      } else if (typeof event.data === "string") {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from the server");
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error(err);
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!socket) {
    return <div>Connectiong to WebSocket...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-black-50">
      <h1 className="mb-4 text-3xl font-bold">Websocket Chat</h1>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="h-64 p-2 mb-4 overflow-y-auto border border-gray-300 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className="p-2 text-black border-b last:border-b-0">
              {message}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={() => {
              if (userMessage) socket.send(userMessage);
              setUserMessage("");
            }}
            className="px-4 text-white transition bg-blue-500 rounded-r-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
