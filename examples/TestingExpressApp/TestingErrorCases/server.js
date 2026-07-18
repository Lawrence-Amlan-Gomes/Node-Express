// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and register the real centralized
// error-handling middleware. The real validation rule, the real thrown
// error, and the real business logic all live one layer down, in
// controllers/.
//
// This app tests two kinds of "not the happy path" behavior:
//   1. Input validation middleware — checking a request BEFORE the real
//      route handler runs, and rejecting it early with a real 400.
//   2. A thrown error inside an async route handler — proving Express
//      5's real automatic behavior: a rejected promise (which is what a
//      throw inside an "async" function actually becomes) gets
//      forwarded to the centralized error-handling middleware
//      automatically. No try/catch needed. That's the same real Express
//      5 behavior taught in the "Error Handling in Express" topic — this
//      section proves it's actually testable too.
import express from "express";
import { pathToFileURL } from "node:url";
import tasksRouter from "./routes/tasks.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /tasks can read req.body.
app.use(express.json());

// Every request under "/tasks" is handed off to the real tasks router.
app.use("/tasks", tasksRouter);

// The REAL centralized error-handling middleware. Express recognizes
// this as error-handling middleware specifically because it takes FOUR
// arguments (err, req, res, next) instead of three — that's not a style
// choice, Express checks the function's arity. This is real app-level
// middleware, so it lives here in server.js, not in a controller.
app.use((err, req, res, next) => {
  if (err.statusCode) {
    // A real, expected error (bad input, missing resource) — safe to
    // send its real message straight to the client.
    return res.status(err.statusCode).json({ error: err.message });
  }
  // A real, UNEXPECTED error. Never leak its real internal message or
  // stack trace to the client — that can reveal internal details an
  // attacker could use. Log the real details server-side only.
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

// Only actually listen when this file is run directly (`node server.js`) —
// server.test.js imports { app } and hands it straight to Supertest
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request. Not
  // 4061 — that's already claimed by SecurityRateLimiting's
  // BrokenAccessControl (confirmed via a full port audit).
  const PORT = process.env.PORT ?? 4077;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
