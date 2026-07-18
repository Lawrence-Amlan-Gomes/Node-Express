// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT import pino directly at all. The real, structured JSON
// log lines below come from the SERVER's own real logger calls,
// running in this same process (no .listen() on a real port needed) —
// they print to the same real stdout this script's own console.log
// lines do, so you'll see them interleaved, in the real order they
// actually happened.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

console.log("=== POST /tasks with a real, valid title — watch for a real structured INFO log below ===");
// A real POST with a genuinely valid title — this really creates a task.
await fetch(`${base}/tasks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Ship the logging topic" }),
});

console.log("\n=== POST /tasks with NO title — watch for a real structured WARN log below ===");
// A real POST with a genuinely missing title — this gets rejected.
await fetch(`${base}/tasks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});

console.log("\n=== GET /tasks/999 — an id that was never created — watch for a real structured WARN log below ===");
// A real GET for a task id that genuinely doesn't exist.
await fetch(`${base}/tasks/999`);

console.log("\n=== GET /tasks — watch for a real structured INFO log with the real current count below ===");
// A real GET for the full real list.
await fetch(`${base}/tasks`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
