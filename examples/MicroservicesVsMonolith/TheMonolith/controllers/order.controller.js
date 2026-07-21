import { ORDERS } from "./data.js";
import { findUserById } from "./user.controller.js";

// "Enriching" an order with its real user's data is just TWO in-memory
// lookups and an object spread — no request goes out anywhere. This is
// the real reason a monolith can do this kind of "join" so cheaply.
export function getOrder(req, res) {
  const start = process.hrtime.bigint();

  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "No order with that id" });
    return;
  }

  // A plain, real, in-process function call — the "orders" code reaching
  // directly into "users" code, since both live in the SAME real process.
  const user = findUserById(order.userId);

  const tookMs = Number(process.hrtime.bigint() - start) / 1_000_000;
  res.json({ ...order, user, tookMs });
}
