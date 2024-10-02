import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Create new websocket connection
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  // Message event listener on the individual WebSocket connection (ws)
  ws.on("message", (data) => {
    console.log("Received msg from the client: " + data);

    // Broadcast the message to all other connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
