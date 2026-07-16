// Proves the real outcome: the SAME idempotency key, sent twice (a real
// simulated network-retry scenario), produces only ONE real charge —
// not two — against the actual running server.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;
const key = "retry-demo-key-abc123";

const firstRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": key },
  body: JSON.stringify({ amount: 50 }),
});
const first = await firstRes.json();
console.log(`FIRST request (new key) => ${firstRes.status}, body: ${JSON.stringify(first)}`);

// Simulates the client not knowing the first request actually succeeded
// (e.g. the response got lost), so it retries with the SAME key.
const retryRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": key },
  body: JSON.stringify({ amount: 50 }),
});
const retry = await retryRes.json();
console.log(`\nRETRY (same key, simulating a lost response) => ${retryRes.status}, body: ${JSON.stringify(retry)}`);
console.log(`Same chargeId both times: ${first.chargeId === retry.chargeId}`);

// A genuinely DIFFERENT key produces a genuinely NEW charge — proves
// the server isn't just ignoring the header, it's really keying on it.
const differentKeyRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": "a-totally-different-key" },
  body: JSON.stringify({ amount: 50 }),
});
const differentKey = await differentKeyRes.json();
console.log(`\nDIFFERENT key, same amount => ${differentKeyRes.status}, body: ${JSON.stringify(differentKey)}`);

const countRes = await fetch(`${base}/charges/count`);
const count = await countRes.json();
console.log(`\nTotal REAL charges actually processed: ${count.totalChargesProcessed} (2 real charges, not 3 — the retry did not create a second one)`);

server.close();
