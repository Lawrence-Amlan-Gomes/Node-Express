// The simplest possible proof this is a real, running server: import the
// real app, start it on a real (temporary, random) port, and make one real
// request to "/" — the only route defined in server.js.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really
// listening, so nothing races a server that isn't ready yet.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// Prove the server is really up before making any request against it.
console.log(`Real server actually started, listening on http://localhost:${port}`);

// The actual real HTTP request — a genuine round trip, not a function call.
const response = await fetch(`http://localhost:${port}/`);
// Parse the real JSON body the server sent back.
const data = await response.json();

// Print the real status and body, proving the route actually ran.
console.log(`GET / => status ${response.status}, body: ${JSON.stringify(data)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
