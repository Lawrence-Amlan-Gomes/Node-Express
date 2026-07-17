// A "middleware" is just a function that runs on a request BEFORE your route
// handler does — think of it as a checkpoint on the way to the destination.
// Express runs them in the EXACT order you register them with app.use(...),
// one after another, top to bottom in this file. Calling next() is how a
// middleware says "I'm done, let the NEXT thing in line run."
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// This middleware runs on EVERY request, because app.use() with no path
// applies to all of them. It's the FIRST one registered, so it runs first.
app.use((req, res, next) => {
  // Start a fresh list, on THIS request's own req object — a new one every time.
  req.orderLog = [];
  // Stamp this middleware's own name onto the list, as proof it ran.
  req.orderLog.push("middleware-1");
  // Hand the request on to whatever's registered next — without this call,
  // nothing below would ever run (see the ForgottenNext example for that bug).
  next();
});

// This middleware runs SECOND, because it was registered second — Express
// doesn't reorder these, it just runs app.use() calls top to bottom.
app.use((req, res, next) => {
  // It doesn't know or care what ran before it — it just adds its own name.
  req.orderLog.push("middleware-2");
  // Hand the request on again, this time to the actual route handler below.
  next();
});

// By the time this route handler runs, both middlewares above have already
// run, in that exact order — this is the very last thing in the chain.
app.get("/order-test", (req, res) => {
  // Add the route handler's own name, so the final list shows the FULL order.
  req.orderLog.push("route-handler");
  // Send back the real list — nothing here is asserted, this IS the real order.
  res.json({ order: req.orderLog });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4003;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
