// Proves the real status code returned for each real outcome, against
// the actual running server — nothing here is asserted or narrated.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}/api/v1`;

const listRes = await fetch(`${base}/todos`);
console.log(`GET /api/v1/todos => ${listRes.status} (existing todos)`);

const createRes = await fetch(`${base}/todos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Write REST conventions demo" }),
});
const created = await createRes.json();
console.log(`POST /api/v1/todos (valid body) => ${createRes.status}, Location: ${createRes.headers.get("location")}`);

const badCreateRes = await fetch(`${base}/todos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
console.log(`POST /api/v1/todos (missing title) => ${badCreateRes.status}`);

const getOneRes = await fetch(`${base}/todos/${created.id}`);
console.log(`GET /api/v1/todos/${created.id} (exists) => ${getOneRes.status}`);

const getMissingRes = await fetch(`${base}/todos/999999`);
console.log(`GET /api/v1/todos/999999 (doesn't exist) => ${getMissingRes.status}`);

const deleteRes = await fetch(`${base}/todos/${created.id}`, { method: "DELETE" });
console.log(`DELETE /api/v1/todos/${created.id} => ${deleteRes.status} (body is real and empty: "${await deleteRes.text()}")`);

const deleteAgainRes = await fetch(`${base}/todos/${created.id}`, { method: "DELETE" });
console.log(`DELETE /api/v1/todos/${created.id} again (already gone) => ${deleteAgainRes.status}`);

server.close();
