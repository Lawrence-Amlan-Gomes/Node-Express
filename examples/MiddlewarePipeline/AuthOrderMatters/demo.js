// Proves that the same requireAuth function genuinely protects
// /protected-correct (registered before the route), but does nothing at all
// for /protected-wrong (registered after the route already responded).
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

await show("1) Correct order, NO auth header (should be blocked)", "/protected-correct");
await show("2) Correct order, WITH the real auth header (should succeed)", "/protected-correct", { "x-auth-token": "secret" });
await show("3) WRONG order, NO auth header (auth check registered too late — succeeds anyway!)", "/protected-wrong");

server.close();
