// This service's OWN real data — no access to users-service's data at
// all, only to its own.
const ORDERS = [{ id: "1", userId: "1", item: "Mechanical Keyboard" }];

// A real, configurable address for a genuinely different real service —
// in production this would be an internal DNS name, not localhost.
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL ?? "http://localhost:4111";

// "Enriching" an order now means a REAL HTTP request to a genuinely
// different real process — this is the real cost a monolith's plain
// in-process function call never had to pay.
export async function getOrder(req, res) {
  const start = process.hrtime.bigint();

  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "No order with that id" });
    return;
  }

  const userResponse = await fetch(`${USERS_SERVICE_URL}/users/${order.userId}`);
  const user = await userResponse.json();

  const tookMs = Number(process.hrtime.bigint() - start) / 1_000_000;
  res.json({ ...order, user, tookMs });
}
