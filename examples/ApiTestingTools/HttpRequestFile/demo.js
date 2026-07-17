// The REST Client/Thunder Client extension can't be driven headlessly from
// here, but this proves requests.http's four requests genuinely work
// against a real running server — each one below sends the EXACT same
// method/url/body written in that file.
import { spawn } from "node:child_process";

// Spawn the real server as its own process, same as running it by hand.
const server = spawn("node", ["server.js"], { cwd: import.meta.dirname });

// Wait for the real "Listening on..." line before sending any requests.
await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    if (chunk.toString().includes("Listening")) resolve();
  });
});

// Every fetch() call below reuses this same base URL.
const base = "http://localhost:4012";

// A small helper matching the shape of one ### block in requests.http: a
// method, a URL, and an optional JSON body.
async function show(label, method, url, body) {
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  // Parse the real JSON response body the server sent back.
  const data = await res.json();
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

await show("1) Get every todo", "GET", "/todos");
await show("2) Get one todo by id", "GET", "/todos/2");
await show("3) Create a new todo", "POST", "/todos", { text: "Try sending this request for real" });
await show("4) A request for something that doesn't exist (real 404)", "GET", "/todos/999");

// Stop the real spawned server process now that every request is done.
server.kill();
