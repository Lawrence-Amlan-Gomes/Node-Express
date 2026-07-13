// A "middleware" is just a function that runs on a request BEFORE your route
// handler does — think of it as a checkpoint on the way to the destination.
// Express runs them in the EXACT order you register them with app.use(...),
// one after another, top to bottom in this file. Calling next() is how a
// middleware says "I'm done, let the NEXT thing in line run."
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// This middleware runs on EVERY request (no path given to app.use). It
// stamps its own name onto req.orderLog, then calls next() to let whatever
// comes next actually run.
app.use((req, res, next) => {
  req.orderLog = [];
  req.orderLog.push("middleware-1");
  next();
});

// This one runs SECOND, because it was registered second. It doesn't know
// or care what ran before it — it just adds its own name and moves on.
app.use((req, res, next) => {
  req.orderLog.push("middleware-2");
  next();
});

// By the time a real route handler runs, both middlewares above have
// already run, in that exact order — this route just proves it by sending
// back req.orderLog, unmodified.
app.get("/order-test", (req, res) => {
  req.orderLog.push("route-handler");
  res.json({ order: req.orderLog });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4003;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
