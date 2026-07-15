// Proves the real, correct Express-4-style pattern: wrapping an async
// handler's body in try/catch and manually calling next(err) gets a real
// error response back from the centralized error middleware below it.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const res = await fetch(`http://localhost:${port}/with-trycatch`);
const data = await res.json();
console.log(`GET /with-trycatch => status ${res.status}, body: ${JSON.stringify(data)}`);

server.close();
