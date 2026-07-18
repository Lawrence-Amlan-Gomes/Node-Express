// Proves the real status code returned for each real outcome, against
// the actual running server — nothing here is asserted or narrated.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}/api/v1`;

// A real GET request against the real, seeded starting list.
const listRes = await fetch(`${base}/todos`);
// Print the real status code Express actually sent back.
console.log(`GET /api/v1/todos => ${listRes.status} (existing todos)`);

// A real POST request with a valid body — this should really create a todo.
const createRes = await fetch(`${base}/todos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Write REST conventions demo" }),
});
// Parse the real JSON body the API sent back, including the new real id.
const created = await createRes.json();
// Print the real 201 status and the real Location header value.
console.log(`POST /api/v1/todos (valid body) => ${createRes.status}, Location: ${createRes.headers.get("location")}`);

// A real POST request with NO title — this should really be rejected.
const badCreateRes = await fetch(`${base}/todos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
// Print the real 400 status the missing-title validation actually produced.
console.log(`POST /api/v1/todos (missing title) => ${badCreateRes.status}`);

// A real GET request for the todo that was really just created above.
const getOneRes = await fetch(`${base}/todos/${created.id}`);
// Print the real 200 status, since this id genuinely exists.
console.log(`GET /api/v1/todos/${created.id} (exists) => ${getOneRes.status}`);

// A real GET request for an id that was never created.
const getMissingRes = await fetch(`${base}/todos/999999`);
// Print the real 404 status, since this id genuinely does not exist.
console.log(`GET /api/v1/todos/999999 (doesn't exist) => ${getMissingRes.status}`);

// A real DELETE request against the todo created above.
const deleteRes = await fetch(`${base}/todos/${created.id}`, { method: "DELETE" });
// Print the real 204 status and prove the real body is truly empty.
console.log(`DELETE /api/v1/todos/${created.id} => ${deleteRes.status} (body is real and empty: "${await deleteRes.text()}")`);

// The SAME delete, sent again — the todo is already gone this time.
const deleteAgainRes = await fetch(`${base}/todos/${created.id}`, { method: "DELETE" });
// Print the real 404 this second delete actually gets back.
console.log(`DELETE /api/v1/todos/${created.id} again (already gone) => ${deleteAgainRes.status}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
