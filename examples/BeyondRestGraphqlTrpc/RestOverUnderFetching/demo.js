import { app } from "./server.js";

const server = app.listen(0);
const { port } = server.address();

// The goal: show the order's item AND the buyer's real name — nothing
// else. Watch how many real requests that takes, and how much real data
// comes back that nobody actually asked for.
const FIELDS_ACTUALLY_NEEDED = ["item", "name"];

console.log('Real goal: show "item" and the buyer\'s "name" — nothing more.\n');

console.log("Request 1 — GET /orders/1:");
const order = await (await fetch(`http://localhost:${port}/orders/1`)).json();
console.log(`  ${JSON.stringify(order)}`);

console.log("\nThe order has no user name on it — a SECOND real request is required:");
console.log(`Request 2 — GET /users/${order.userId}:`);
const user = await (await fetch(`http://localhost:${port}/users/${order.userId}`)).json();
console.log(`  ${JSON.stringify(user)}`);

const userFieldsReturned = Object.keys(user);
const unusedFields = userFieldsReturned.filter((field) => !FIELDS_ACTUALLY_NEEDED.includes(field));

console.log(`\nReal total requests needed: 2 (this is REST's real "under-fetching" cost).`);
console.log(`Real fields returned by /users/${order.userId}: ${JSON.stringify(userFieldsReturned)}`);
console.log(`Real fields actually needed from that response: ${JSON.stringify(FIELDS_ACTUALLY_NEEDED.filter((f) => f !== "item"))}`);
console.log(`Real UNUSED fields sent over the wire anyway: ${JSON.stringify(unusedFields)} — REST's real "over-fetching" cost.`);

server.close();
