import { httpServer } from "./server.js";
import { WebSocket } from "ws";

// Port 0 — a real, OS-assigned, always-free port for this demo's own
// throwaway server instance. See co-founder/build-conventions.md.
await new Promise((resolve) => httpServer.listen(0, resolve));
const { port } = httpServer.address();

console.log(`Connecting a real WebSocket client to ws://localhost:${port}/ws ...`);

const receivedMessages = [];

await new Promise((resolve, reject) => {
  const socket = new WebSocket(`ws://localhost:${port}/ws`);

  socket.on("message", (raw) => {
    const data = JSON.parse(raw.toString());
    receivedMessages.push(data);
    console.log(`  Real message FROM the server: ${JSON.stringify(data)}`);

    if (data.type === "welcome") {
      // Only sent because we already received the server's own real,
      // unprompted push — proves this is one real, already-open
      // connection, not a fresh request.
      console.log('  Sending a real message TO the server: "ping"');
      socket.send("ping");
    }

    if (data.type === "pong") {
      socket.close();
    }
  });

  socket.on("close", resolve);
  socket.on("error", reject);
});

console.log(`\nReal messages exchanged over ONE real connection: ${receivedMessages.length}`);
console.log("Both directions used the SAME open connection — no new HTTP request for either one.");

httpServer.close();
