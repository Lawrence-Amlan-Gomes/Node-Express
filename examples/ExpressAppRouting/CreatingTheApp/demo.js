// The simplest possible proof this is a real, running server: import the
// real app, start it on a real (temporary, random) port, and make one real
// request to "/" — the only route defined in server.js.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

console.log(`Real server actually started, listening on http://localhost:${port}`);

const response = await fetch(`http://localhost:${port}/`);
const data = await response.json();

console.log(`GET / => status ${response.status}, body: ${JSON.stringify(data)}`);

server.close();
