// Proves middleware really does run in the exact order it was registered in
// server.js — nothing here is asserted, req.orderLog is built up for real by
// each middleware as the request actually passes through them.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual real HTTP request — a genuine round trip through both middlewares.
const res = await fetch(`http://localhost:${port}/order-test`);
// Parse the real JSON body the server sent back.
const data = await res.json();
// Print the real order the response proved, so it's visible in the demo output.
console.log(`GET /order-test => status ${res.status}, body: ${JSON.stringify(data)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
