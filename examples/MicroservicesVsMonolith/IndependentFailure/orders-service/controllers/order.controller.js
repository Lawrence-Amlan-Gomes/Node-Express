const ORDERS = [{ id: "1", userId: "1", item: "Mechanical Keyboard" }];

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL ?? "http://localhost:4113";

// Needs NOTHING from users-service — proves this service can keep
// answering SOME of its real requests even if users-service is
// completely down.
export function getOrderBasic(req, res) {
  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "No order with that id" });
    return;
  }
  res.json(order);
}

// Needs a REAL call to users-service — this is the one real request that
// SHOULD fail if users-service is down. The important part is HOW it
// fails: a real, deliberate 503 with a clear reason, never an uncaught
// exception that could take this whole real process down with it.
export async function getOrderEnriched(req, res) {
  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "No order with that id" });
    return;
  }

  try {
    const userResponse = await fetch(`${USERS_SERVICE_URL}/users/${order.userId}`);
    const user = await userResponse.json();
    res.json({ ...order, user });
  } catch {
    // A real, deliberate, CAUGHT failure — this service stays up and
    // keeps answering every other real request, it just can't complete
    // THIS one without its real dependency.
    res.status(503).json({ error: "users-service is unreachable — try again later", orderId: order.id });
  }
}
