// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// A real, in-memory list of orders — enough to prove the real BOLA bug
// and its fix without needing a real database for this specific concept.
const orders = [
  { id: 101, userId: 1, item: "Laptop", total: 1200 },
  { id: 102, userId: 2, item: "Headphones", total: 150 },
];

// Handles GET /orders-vulnerable/:id.
// THE VULNERABILITY: fetches an order by id, but never checks whether
// THIS request's real user actually owns it. Any authenticated user can
// read ANY order just by changing the id in the URL.
export function getOrderVulnerable(req, res) {
  // Look for a real order whose id matches the real URL param.
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    // This exact id genuinely doesn't exist — a real 404.
    res.status(404).json({ error: "order not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // No ownership check at all — hand the real order over regardless of who asked.
  res.status(200).json(order);
}

// Handles GET /orders-fixed/:id.
// THE FIX: the exact same lookup, PLUS a real object-level ownership
// check — the order must actually belong to the requesting user, or the
// server refuses, even though the order genuinely exists.
export function getOrderFixed(req, res) {
  // Look for a real order whose id matches the real URL param.
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) {
    // This exact id genuinely doesn't exist — a real 404.
    res.status(404).json({ error: "order not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // THE ACTUAL FIX: does this order really belong to the requesting user?
  if (order.userId !== req.userId) {
    // It exists, but not for this user — a real 403, not a data leak.
    res.status(403).json({ error: "you do not have access to this order" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // It genuinely belongs to this user — hand it over for real.
  res.status(200).json(order);
}
