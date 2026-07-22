// v1 — the ORIGINAL, documented shape a real frontend was built against:
// a "name" field. This is the honored contract.
export function getProfileV1(req, res) {
  res.status(200).json({ id: 1, name: "Ada Lovelace", email: "ada@example.com" });
}

// v2 — a real backend dev renamed "name" to "fullName" without telling
// anyone. Nothing here is a bug in the traditional sense — the endpoint
// still returns valid JSON, still 200s. It just silently BROKE the
// contract a real frontend was relying on.
export function getProfileV2(req, res) {
  res.status(200).json({ id: 1, fullName: "Ada Lovelace", email: "ada@example.com" });
}
