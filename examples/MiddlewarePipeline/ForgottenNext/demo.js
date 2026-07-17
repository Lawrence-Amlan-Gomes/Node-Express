// Proves the real, correct pattern: a middleware that calls next() really
// does let the request continue on to the route handler after it.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual real HTTP request — a genuine round trip through the middleware.
const res = await fetch(`http://localhost:${port}/works`);
// Parse the real JSON body the server sent back.
const data = await res.json();
// Print the real status and body, proving the route actually ran.
console.log(`GET /works => status ${res.status}, body: ${JSON.stringify(data)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
