import { ORDERS } from "./data.js";

// This real endpoint only knows about orders — it has no "user" field at
// all, just a userId. A client that wants the buyer's name has no choice
// but to make a SECOND real request.
export function getOrder(req, res) {
  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: "No order with that id" });
    return;
  }
  res.json(order);
}
