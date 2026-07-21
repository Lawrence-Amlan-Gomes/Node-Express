import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { pathToFileURL } from "node:url";
import { registerRoomHandlers } from "./sockets/room.socket.js";

const app = express();
const httpServer = createServer(app);

// Socket.io wraps a real WebSocket connection (falling back to real HTTP
// long-polling automatically if a WebSocket can't be established) and
// adds real, higher-level features on top — rooms are one of them.
const io = new Server(httpServer, { cors: { origin: "*" } });
registerRoomHandlers(io);

const PORT = process.env.PORT ?? 4106;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export { app, httpServer };
