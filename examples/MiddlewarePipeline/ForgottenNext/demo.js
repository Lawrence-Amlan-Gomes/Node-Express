// Proves the real, correct pattern: a middleware that calls next() really
// does let the request continue on to the route handler after it.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const res = await fetch(`http://localhost:${port}/works`);
const data = await res.json();
console.log(`GET /works => status ${res.status}, body: ${JSON.stringify(data)}`);

server.close();
