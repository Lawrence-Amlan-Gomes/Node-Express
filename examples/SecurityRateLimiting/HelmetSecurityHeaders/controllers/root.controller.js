// A "controller" is where the ACTUAL logic for a request lives. This
// section's whole point is the RESPONSE HEADERS, which are set by
// middleware before this handler ever runs — so the handler body itself
// is deliberately trivial, the same on both the with-helmet and
// without-helmet app.

// Handles GET / on both apps.
export function getRoot(req, res) {
  // Send back a real, minimal reply — the interesting part of this demo
  // is entirely in the response HEADERS, not this body.
  res.json({ ok: true });
}
