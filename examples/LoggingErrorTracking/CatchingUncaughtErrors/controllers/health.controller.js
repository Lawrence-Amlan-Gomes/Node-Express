// A "controller" is where the ACTUAL logic for a request lives — a
// real, minimal endpoint so this app has a real HTTP surface, even
// though this section's real point is what happens OUTSIDE any request
// at all.

// Handles GET /health.
export function getHealth(req, res) {
  // A real, minimal reply — proves the app is genuinely still up and answering.
  res.status(200).json({ ok: true });
}
