// Proves the real, correct pattern: requireAuth genuinely blocks
// /protected-correct with no valid header, and genuinely allows it through
// with the real one.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

async function show(label, url, headers) {
  const res = await fetch(`${base}${url}`, { headers });
  const data = await res.json();
  console.log(`${label}\n  GET ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

await show("1) NO auth header (should be blocked)", "/protected-correct");
await show("2) WITH the real auth header (should succeed)", "/protected-correct", { "x-auth-token": "secret" });

server.close();
