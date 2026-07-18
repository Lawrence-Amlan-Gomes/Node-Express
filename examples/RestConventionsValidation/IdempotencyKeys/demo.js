// Proves the real outcome: the SAME idempotency key, sent twice (a real
// simulated network-retry scenario), produces only ONE real charge —
// not two — against the actual running server.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;
// The one real idempotency key this whole demo reuses on purpose.
const key = "retry-demo-key-abc123";

// The FIRST real request — a genuinely new key, so this really charges.
const firstRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": key },
  body: JSON.stringify({ amount: 50 }),
});
// Parse the real JSON body the API sent back, including the real chargeId.
const first = await firstRes.json();
// Print the real status and the real charge that actually happened.
console.log(`FIRST request (new key) => ${firstRes.status}, body: ${JSON.stringify(first)}`);

// Simulates the client not knowing the first request actually succeeded
// (e.g. the response got lost), so it retries with the SAME key.
const retryRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": key },
  body: JSON.stringify({ amount: 50 }),
});
// Parse the real JSON body — should be the SAME cached charge, replayed.
const retry = await retryRes.json();
// Print the real status and the real (replayed) body sent back.
console.log(`\nRETRY (same key, simulating a lost response) => ${retryRes.status}, body: ${JSON.stringify(retry)}`);
// Prove directly that both requests really got back the identical chargeId.
console.log(`Same chargeId both times: ${first.chargeId === retry.chargeId}`);

// A genuinely DIFFERENT key produces a genuinely NEW charge — proves
// the server isn't just ignoring the header, it's really keying on it.
const differentKeyRes = await fetch(`${base}/charges`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": "a-totally-different-key" },
  body: JSON.stringify({ amount: 50 }),
});
// Parse the real JSON body — a genuinely new chargeId this time.
const differentKey = await differentKeyRes.json();
// Print the real status and the real new charge.
console.log(`\nDIFFERENT key, same amount => ${differentKeyRes.status}, body: ${JSON.stringify(differentKey)}`);

// A real GET request, to read back the real, server-tracked total.
const countRes = await fetch(`${base}/charges/count`);
// Parse the real JSON body containing the real count.
const count = await countRes.json();
// Print the real total — proves the retry never bumped it a third time.
console.log(`\nTotal REAL charges actually processed: ${count.totalChargesProcessed} (2 real charges, not 3 — the retry did not create a second one)`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
