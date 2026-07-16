// Proves the real limit, against the actual running server — 7 real
// requests sent in a row to an endpoint allowing only 5 per window.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

for (let i = 1; i <= 7; i++) {
  const res = await fetch(`${base}/limited`);
  const remaining = res.headers.get("ratelimit-remaining");
  const limit = res.headers.get("ratelimit-limit");
  console.log(`Request ${i} => ${res.status} (RateLimit-Limit: ${limit}, RateLimit-Remaining: ${remaining})`);
  if (res.status === 429) {
    const body = await res.json();
    console.log(`   Real 429 body: ${JSON.stringify(body)}`);
  }
}

server.close();
