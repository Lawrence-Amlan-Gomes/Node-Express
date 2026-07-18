// A "controller" is where the ACTUAL logic for a request lives. Nothing
// in here knows or cares that a rate limiter ran before it — that's the
// routes file's job, not this one. This handler only ever runs at all
// once the real limiter has already let the request through.

// Handles GET /limited.
export function getLimited(req, res) {
  // Send back a real, fixed JSON reply — proving this request got through the limiter.
  res.status(200).json({ data: "this request was allowed through" });
}
