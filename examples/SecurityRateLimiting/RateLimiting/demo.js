// Proves the real limit, against the actual running server — 7 real
// requests sent in a row to an endpoint allowing only 5 per window.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

for (let i = 1; i <= 7; i++) {
  // Send one real request — the SAME client, hitting the SAME route, every time.
  const res = await fetch(`${base}/limited`);
  // Read the real, live countdown straight off the response header.
  const remaining = res.headers.get("ratelimit-remaining");
  // Read the real configured limit straight off the response header too.
  const limit = res.headers.get("ratelimit-limit");
  // Print the real status and the real remaining count for this exact request.
  console.log(`Request ${i} => ${res.status} (RateLimit-Limit: ${limit}, RateLimit-Remaining: ${remaining})`);
  if (res.status === 429) {
    // Parse the real JSON body — the real, structured rejection message.
    const body = await res.json();
    // Print the real 429 body, proving it's real JSON, not the library's plain-text default.
    console.log(`   Real 429 body: ${JSON.stringify(body)}`);
  }
}

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
