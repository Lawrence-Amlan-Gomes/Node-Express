// Proves the real, correct pattern: requireAuth genuinely blocks
// /protected-correct with no valid header, and genuinely allows it through
// with the real one.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
// Every fetch() call below reuses this same base URL.
const base = `http://localhost:${port}`;

// A tiny helper so both real requests below print the same shape of output.
async function show(label, url, headers) {
  // The actual real HTTP request — headers control whether requireAuth passes.
  const res = await fetch(`${base}${url}`, { headers });
  // Parse the real JSON body the server sent back.
  const data = await res.json();
  // Print the real status and body, so the block/allow behavior is visible.
  console.log(`${label}\n  GET ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

// Real request #1: no header at all — requireAuth should block this one.
await show("1) NO auth header (should be blocked)", "/protected-correct");
// Real request #2: the correct header — requireAuth should let this one through.
await show("2) WITH the real auth header (should succeed)", "/protected-correct", { "x-auth-token": "secret" });

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
