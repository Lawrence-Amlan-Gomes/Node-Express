// demo.js only calls the real, running API and prints what comes back.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

// A genuinely valid order — passes the real spec, reaches the controller.
const validRes = await fetch(`${base}/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: 42, quantity: 2 }),
});
const validBody = await validRes.json();
console.log(`POST /orders (valid) => ${validRes.status}`, JSON.stringify(validBody));

// Wrong TYPE for productId — a real contract violation, caught before
// this project's own controller code ever runs.
const wrongTypeRes = await fetch(`${base}/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: "not-a-number", quantity: 2 }),
});
const wrongTypeBody = await wrongTypeRes.json();
console.log(`\nPOST /orders (productId is a string, not an integer) => ${wrongTypeRes.status}`, JSON.stringify(wrongTypeBody));

// A required field missing entirely.
const missingFieldRes = await fetch(`${base}/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: 42 }),
});
const missingFieldBody = await missingFieldRes.json();
console.log(`\nPOST /orders (quantity missing entirely) => ${missingFieldRes.status}`, JSON.stringify(missingFieldBody));

// A value that violates the spec's own minimum: 1 constraint.
const belowMinRes = await fetch(`${base}/orders`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: 42, quantity: 0 }),
});
const belowMinBody = await belowMinRes.json();
console.log(`\nPOST /orders (quantity: 0, violates minimum: 1) => ${belowMinRes.status}`, JSON.stringify(belowMinBody));

// A real, valid lookup.
const getRes = await fetch(`${base}/orders/1`);
const getBody = await getRes.json();
console.log(`\nGET /orders/1 => ${getRes.status}`, JSON.stringify(getBody));

// A path param whose TYPE violates the spec (should be an integer) —
// caught by the validator before the controller's Number(req.params.id)
// ever runs.
const badIdRes = await fetch(`${base}/orders/abc`);
const badIdBody = await badIdRes.json();
console.log(`\nGET /orders/abc (id must be an integer per the spec) => ${badIdRes.status}`, JSON.stringify(badIdBody));

// A real, VALID id that simply doesn't exist — not a contract violation,
// so this genuinely reaches the controller's own real 404 logic.
const missingIdRes = await fetch(`${base}/orders/999`);
const missingIdBody = await missingIdRes.json();
console.log(`\nGET /orders/999 (valid integer, no such order) => ${missingIdRes.status}`, JSON.stringify(missingIdBody));

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
