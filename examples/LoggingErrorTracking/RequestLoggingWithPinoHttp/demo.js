// Calls the real, running Express API (server.js) over real HTTP — no
// logging code runs anywhere in this file OR in any route handler.
// Every real log line below comes entirely from pino-http's own
// automatic request logging, running in this same process, printed to
// the same real stdout this script's own console.log lines use.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

console.log("=== GET /tasks/2 — a real, existing task — watch for an automatic INFO log (level 30) below ===");
// A real GET for a task id that genuinely exists.
await fetch(`${base}/tasks/2`);

console.log("\n=== GET /tasks/999 — a real, missing task — watch for an automatic WARN log (level 40) below ===");
// A real GET for a task id that was never seeded.
await fetch(`${base}/tasks/999`);

console.log("\n=== GET /broken — a real, deliberate 500 — watch for an automatic ERROR log (level 50) below ===");
// A real GET against a route that deliberately fails.
await fetch(`${base}/broken`);

console.log("\nNotice: NONE of the three routes above wrote a single log line themselves — every log line above came entirely from pino-http's own middleware, running once per request.");

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
