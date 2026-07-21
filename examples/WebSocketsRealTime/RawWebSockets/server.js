import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { pathToFileURL } from "node:url";
import statusRoutes from "./routes/status.routes.js";
import { registerEchoHandlers } from "./sockets/echo.socket.js";

const app = express();
app.use("/", statusRoutes);

// WebSockets need Node's own raw http.Server underneath — Express itself
// has no "upgrade" handling built in, so we create the real server
// explicitly and hand Express to it as the normal request handler.
const httpServer = createServer(app);

// Attached at a specific real path — a client asks THIS server to
// "upgrade" an HTTP connection at ws://host:port/ws, not open a brand new
// kind of connection from scratch.
const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
registerEchoHandlers(wss);

const PORT = process.env.PORT ?? 4105;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export { app, httpServer };
