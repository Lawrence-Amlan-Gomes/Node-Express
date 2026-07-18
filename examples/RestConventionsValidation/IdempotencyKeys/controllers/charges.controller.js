// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// The real problem this solves: a client POSTs "/charges" to charge a
// card $50. The request succeeds on the server, but the RESPONSE gets
// lost (a flaky network, a timeout) — the client never finds out it
// worked, and safely retries. Without protection, that retry creates a
// SECOND real $50 charge. An idempotency key fixes this: the client
// sends the SAME key on the retry, and the server recognizes it's the
// same logical request, returning the ORIGINAL result instead of
// charging again. This is the real pattern Stripe and PayPal use.

// A real store keeping track of which idempotency keys have already
// been used, and what response they produced. A real production system
// would use a real database with a TTL (keys don't need to live
// forever) — an in-memory Map is enough to prove the real mechanism.
const seenKeys = new Map();
// Tracks the next real id to hand out to a genuinely new charge.
let nextChargeId = 1;
// Counts only the charges that ACTUALLY ran — a retry must never bump this.
let totalChargesProcessed = 0;

// Handles POST /charges.
export function createCharge(req, res) {
  // Read the real key straight off the request header.
  const idempotencyKey = req.get("Idempotency-Key");
  if (!idempotencyKey) {
    // No key at all — this request can't be made retry-safe, reject it.
    res.status(400).json({ error: "Idempotency-Key header is required" });
    // Stop here — without this, the code below would also try to run.
    return;
  }

  // THE ACTUAL CHECK: has this exact key been used before? If so, this
  // is a retry of a request we already processed — return the SAME
  // stored result instead of creating a new charge.
  if (seenKeys.has(idempotencyKey)) {
    // Pull back the real, original result that was cached for this key.
    const cached = seenKeys.get(idempotencyKey);
    // Send the SAME charge back, just flagged as a real replay.
    res.status(200).json({ ...cached, replayed: true });
    // Stop here — without this, the code below would also try to run.
    return;
  }

  // A genuinely NEW key — actually process the charge for real (this is
  // the part that must only ever happen once per idempotency key).
  totalChargesProcessed++;
  // Build the real new charge record, with its own real, fresh id.
  const charge = { chargeId: nextChargeId++, amount: req.body.amount, replayed: false };
  // Remember this key and its real result, so a future retry can find it.
  seenKeys.set(idempotencyKey, charge);
  // 201 — a genuinely new charge was really created.
  res.status(201).json(charge);
}

// Handles GET /charges/count.
export function getChargeCount(req, res) {
  // Report the real count of charges that actually ran — proves a retry
  // never sneaks a second real charge past this number.
  res.status(200).json({ totalChargesProcessed });
}
