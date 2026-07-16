// BOLA — Broken Object Level Authorization — is OWASP's real #1 most
// common API vulnerability, found in ~88% of audited Node APIs per
// current research. The bug: an endpoint correctly checks that a
// request is AUTHENTICATED (this really is a real, logged-in user), but
// never checks whether that SPECIFIC user is actually allowed to touch
// the SPECIFIC object being requested — id 42 works no matter whose
// order it actually is.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// A real X-User-Id header stands in for "already-verified identity from
// a real auth layer" (JWT/session — see the Authentication Patterns
// topic) — the point of THIS topic is what happens AFTER authentication,
// not how the user got authenticated in the first place.
function identifyUser(req, res, next) {
  const userId = Number(req.get("X-User-Id"));
  if (!userId) {
    return res.status(401).json({ error: "X-User-Id header required" });
  }
  req.userId = userId;
  next();
}
app.use(identifyUser);

const orders = [
  { id: 101, userId: 1, item: "Laptop", total: 1200 },
  { id: 102, userId: 2, item: "Headphones", total: 150 },
];

// THE VULNERABILITY: fetches an order by id, but never checks whether
// THIS request's real user actually owns it. Any authenticated user
// can read ANY order just by changing the id in the URL.
app.get("/orders-vulnerable/:id", (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "order not found" });
  res.status(200).json(order);
});

// THE FIX: the exact same lookup, PLUS a real object-level ownership
// check — the order must actually belong to the requesting user, or the
// server refuses, even though the order genuinely exists.
app.get("/orders-fixed/:id", (req, res) => {
  const order = orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "order not found" });
  if (order.userId !== req.userId) {
    return res.status(403).json({ error: "you do not have access to this order" });
  }
  res.status(200).json(order);
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4061;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
