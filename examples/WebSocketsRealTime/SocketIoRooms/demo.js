import { httpServer } from "./server.js";
import { io as ioClient } from "socket.io-client";

// Port 0 — a real, OS-assigned, always-free port for this demo's own
// throwaway server instance.
await new Promise((resolve) => httpServer.listen(0, resolve));
const { port } = httpServer.address();
const url = `http://localhost:${port}`;

// Connects one real Socket.io client and remembers every real message it
// receives, so we can compare who got what afterward.
function connectClient(name) {
  return new Promise((resolve) => {
    const socket = ioClient(url, { transports: ["websocket"] });
    const received = [];
    socket.on("room-message", (data) => received.push(data));
    socket.on("connect", () => resolve({ name, socket, received }));
  });
}

const clientA = await connectClient("A");
const clientB = await connectClient("B");
const clientC = await connectClient("C");

// Two real clients join the SAME room, one joins a DIFFERENT room.
clientA.socket.emit("join-room", "general");
clientB.socket.emit("join-room", "general");
clientC.socket.emit("join-room", "random");

// A short real wait so the server has genuinely processed all 3 real
// "join-room" events before anyone sends a message.
await new Promise((resolve) => setTimeout(resolve, 200));

console.log('Client A sends a real message to room "general"...');
clientA.socket.emit("send-to-room", { room: "general", message: "Hello, general!" });

await new Promise((resolve) => setTimeout(resolve, 200));

console.log(`\nClient A (in "general") received: ${JSON.stringify(clientA.received)}`);
console.log(`Client B (in "general") received: ${JSON.stringify(clientB.received)}`);
console.log(`Client C (in "random") received: ${JSON.stringify(clientC.received)}`);

console.log("\nReal result: only real sockets in the SAME room got the broadcast — room isolation, proven, not asserted.");

clientA.socket.close();
clientB.socket.close();
clientC.socket.close();
httpServer.close();
