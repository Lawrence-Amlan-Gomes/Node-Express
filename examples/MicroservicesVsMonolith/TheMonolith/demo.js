import { app } from "./server.js";

const server = app.listen(0);
const { port } = server.address();

console.log("Real GET /orders/1 — enriching an order with its user, entirely in-process:");
const order = await (await fetch(`http://localhost:${port}/orders/1`)).json();
console.log(JSON.stringify(order, null, 2));

console.log(`\nReal time spent "joining" order and user data: ${order.tookMs.toFixed(4)}ms — no network involved at all.`);

server.close();
