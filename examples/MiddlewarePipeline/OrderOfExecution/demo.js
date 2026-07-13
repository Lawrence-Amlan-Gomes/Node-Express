// Proves middleware really does run in the exact order it was registered in
// server.js — nothing here is asserted, req.orderLog is built up for real by
// each middleware as the request actually passes through them.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const res = await fetch(`http://localhost:${port}/order-test`);
const data = await res.json();
console.log(`GET /order-test => status ${res.status}, body: ${JSON.stringify(data)}`);

server.close();
