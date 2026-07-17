// This file imports the SAME real app defined in server.js and tests every
// route on it by actually calling them over real HTTP, the same way a
// browser or another program would.
import { app } from "./server.js";

// Port 0 means "give me any free port" — that's just so this demo never
// collides with something else already using a fixed port.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
// Every fetch() call below reuses this same base URL.
const base = `http://localhost:${port}`;

// A small helper so we don't repeat "make a request, read the JSON, print
// it" for each route below.
async function show(label, method, url, body) {
  // The actual real HTTP request — a genuine round trip against the real app.
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  // Parse the real JSON response body the server sent back.
  const data = await res.json();
  // Print the real status and body, so each route's actual behavior is visible.
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

// Real request #1: proves req.params — the :name placeholder in the route path.
await show("1) Route param (req.params)", "GET", "/greet/Lawrence");
// Real request #2: proves req.query — the ?q=... part of the URL.
await show("2) Query param (req.query)", "GET", "/search?q=express");
// Real request #3: proves req.body — only readable because express.json() ran first.
await show("3) A real JSON body (express.json())", "POST", "/echo", { hello: "world" });
// Real request #4: proves the mounted router — this route lives in api-routes.js, not here.
await show("4) A modular express.Router(), mounted at /api", "GET", "/api/status");
// Real request #5: proves the catch-all 404 — nothing above matches this path.
await show("5) The real default 404 for anything unmatched", "GET", "/does-not-exist");

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
