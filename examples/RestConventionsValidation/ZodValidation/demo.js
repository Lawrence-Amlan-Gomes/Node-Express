// Proves the real 400 response (with real per-field error messages) for
// invalid input, and the real 201 for valid input — against the actual
// running server, running zod's actual validation logic.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

const invalidRes = await fetch(`${base}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "", email: "not-an-email", age: -5 }),
});
const invalidBody = await invalidRes.json();
console.log(`POST /users (invalid: empty name, bad email, negative age) => ${invalidRes.status}`);
console.log(JSON.stringify(invalidBody, null, 2));

const validRes = await fetch(`${base}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", age: 28 }),
});
const validBody = await validRes.json();
console.log(`\nPOST /users (valid) => ${validRes.status}`);
console.log(JSON.stringify(validBody, null, 2));

server.close();
