// Proves the real, correct Express-4-style pattern: wrapping an async
// handler's body in try/catch and manually calling next(err) gets a real
// error response back from the centralized error middleware below it.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual real HTTP request — the route throws, but catches it manually.
const res = await fetch(`http://localhost:${port}/with-trycatch`);
// Parse the real JSON body the server sent back.
const data = await res.json();
// Print the real status and body — proof the manual next(err) call worked.
console.log(`GET /with-trycatch => status ${res.status}, body: ${JSON.stringify(data)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
