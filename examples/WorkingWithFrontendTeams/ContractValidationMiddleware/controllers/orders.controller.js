// This controller ONLY ever runs for requests that ALREADY passed the
// real spec validation in server.js — it never has to re-check that
// productId/quantity exist or are the right type. The contract is
// enforced once, in one place, not re-implemented in every handler.

// A plain in-memory array stands in for a real database.
const orders = [];
// The next real id an order will get.
let nextId = 1;

// Handles POST /orders.
export function createOrder(req, res) {
  // req.body is ALREADY guaranteed to have a real integer productId and
  // a real integer quantity >= 1 — the validator middleware rejected
  // anything else before this function ever ran.
  const order = { id: nextId, ...req.body };
  // Bump the counter so the NEXT order gets a genuinely unique id.
  nextId += 1;
  // Actually add it to the real in-memory store.
  orders.push(order);
  // 201 — this request created a new real resource.
  res.status(201).json(order);
}

// Handles GET /orders/:id.
export function getOrder(req, res) {
  // The validator already confirmed :id is a real integer — Number()
  // here just converts the string param for a real comparison.
  const id = Number(req.params.id);
  // .find() returns the real matching order, or undefined if none exists.
  const order = orders.find((o) => o.id === id);

  // A missing resource is a real 404 — this ISN'T a contract violation
  // (the spec allows 404 as a real, documented response), so it reaches
  // this controller code normally.
  if (!order) {
    res.status(404).json({ error: `No order with id ${id}` });
    return;
  }

  // Found it — send the real order back.
  res.status(200).json(order);
}
