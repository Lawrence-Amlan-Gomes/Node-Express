// This file builds a REAL centralized error handler — one place, at the
// bottom of the file, that decides how every error in the whole app becomes
// an HTTP response.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// A custom error class. Nothing magic about it — it's a plain subclass of
// the built-in Error, with one extra field: statusCode. Throwing one of
// these lets a route say exactly which HTTP status the problem deserves
// (404 for "not found", 400 for "bad input", etc.) instead of everything
// defaulting to a generic 500.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// This route deliberately looks for a resource that doesn't exist, and
// throws an AppError with a real, specific status code (404). Since this is
// an async handler, Express 5 forwards this rejection automatically — same
// mechanism as the AutomaticForwarding example, just with a custom error
// type this time instead of a plain Error.
app.get("/users/:id", async (req, res) => {
  const knownUserIds = ["1", "2", "3"];
  if (!knownUserIds.includes(req.params.id)) {
    throw new AppError(`No user with id ${req.params.id}`, 404);
  }
  res.json({ id: req.params.id, name: `User ${req.params.id}` });
});

// This route throws a PLAIN Error, not an AppError — simulating a genuine
// unexpected bug (a typo, a null reference, anything unplanned) rather than
// an intentional, well-understood failure. It has no statusCode of its own.
app.get("/unexpected-bug", async (req, res) => {
  throw new Error("Something the developer didn't plan for");
});

// The centralized error-handling middleware. Express recognizes this as an
// error handler SPECIFICALLY because it takes 4 arguments — (err, req, res,
// next) — not because of where it's defined or what it's named. A function
// with only 3 arguments is always treated as regular middleware, never as
// an error handler, no matter what it does internally.
//
// This MUST be registered after every route it's meant to catch errors
// from — exactly like ordinary middleware order rules (see the Middleware
// Pipeline topic). An error thrown by a route registered AFTER this
// middleware would never reach it.
app.use((err, req, res, next) => {
  // err.statusCode only exists on AppError instances we threw ourselves.
  // A plain, unplanned Error has no statusCode at all, so this defaults to
  // 500 — "something went wrong and we didn't specifically plan for it."
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({ error: err.message });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4022;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
