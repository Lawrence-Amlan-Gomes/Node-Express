// Proves the real 400 response (with real per-field error messages) for
// invalid input, and the real 201 for valid input — against the actual
// running server, running zod's actual validation logic.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

// A truly broken body — empty name, bad email format, a negative age.
const invalidRes = await fetch(`${base}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "", email: "not-an-email", age: -5 }),
});
// Parse the real JSON body — the real, per-field error list zod produced.
const invalidBody = await invalidRes.json();
// Print the real 400 status this invalid body actually got back.
console.log(`POST /users (invalid: empty name, bad email, negative age) => ${invalidRes.status}`);
// Print the real, full error object, not just a summary.
console.log(JSON.stringify(invalidBody, null, 2));

// A genuinely valid body — every field really passes the schema.
const validRes = await fetch(`${base}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", age: 28 }),
});
// Parse the real JSON body — the real, validated, saved user.
const validBody = await validRes.json();
// Print the real 201 status this valid body actually got back.
console.log(`\nPOST /users (valid) => ${validRes.status}`);
// Print the real created user object.
console.log(JSON.stringify(validBody, null, 2));

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
