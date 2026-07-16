// The real problem this solves: a client POSTs "/charges" to charge a
// card $50. The request succeeds on the server, but the RESPONSE gets
// lost (a flaky network, a timeout) — the client never finds out it
// worked, and safely retries. Without protection, that retry creates a
// SECOND real $50 charge. An idempotency key fixes this: the client
// sends the SAME key on the retry, and the server recognizes it's the
// same logical request, returning the ORIGINAL result instead of
// charging again. This is the real pattern Stripe and PayPal use.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

// A real store keeping track of which idempotency keys have already
// been used, and what response they produced. A real production system
// would use a real database with a TTL (keys don't need to live
// forever) — an in-memory Map is enough to prove the real mechanism.
const seenKeys = new Map();
let nextChargeId = 1;
let totalChargesProcessed = 0;

app.post("/charges", (req, res) => {
  const idempotencyKey = req.get("Idempotency-Key");
  if (!idempotencyKey) {
    return res.status(400).json({ error: "Idempotency-Key header is required" });
  }

  // THE ACTUAL CHECK: has this exact key been used before? If so, this
  // is a retry of a request we already processed — return the SAME
  // stored result instead of creating a new charge.
  if (seenKeys.has(idempotencyKey)) {
    const cached = seenKeys.get(idempotencyKey);
    return res.status(200).json({ ...cached, replayed: true });
  }

  // A genuinely NEW key — actually process the charge for real (this is
  // the part that must only ever happen once per idempotency key).
  totalChargesProcessed++;
  const charge = { chargeId: nextChargeId++, amount: req.body.amount, replayed: false };
  seenKeys.set(idempotencyKey, charge);
  res.status(201).json(charge);
});

app.get("/charges/count", (req, res) => {
  res.status(200).json({ totalChargesProcessed });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4042;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
