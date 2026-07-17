// This example proves that WHERE you register a middleware changes real
// behavior, not just execution order on paper.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// A tiny fake "auth check" middleware — a real one would check a database
// or verify a token; this one just checks for one specific header value.
function requireAuth(req, res, next) {
  // If the right header is present, the request is allowed through.
  if (req.headers["x-auth-token"] === "secret") {
    // Hand the request on to whatever's registered after this — the real route.
    next();
  } else {
    // No valid header: respond right here with 401, and do NOT call next().
    // Nothing registered after this middleware ever runs for this request.
    res.status(401).json({ error: "unauthorized" });
  }
}

// THE CORRECT PATTERN, and the only route that actually runs in this file:
// requireAuth is passed as a SECOND argument to app.get, which Express
// treats as "run this middleware first, then the real handler below" —
// this route is genuinely protected, not just described as protected.
app.get("/protected-correct", requireAuth, (req, res) => {
  // This line only ever runs if requireAuth above already called next().
  res.json({ message: "you got in — correct order, real auth check ran first" });
});

// THE MISTAKE (shown only as a comment, never actually run in this project
// — see co-founder/build-conventions.md's "wrong code stays in comments"
// rule). If requireAuth were registered AFTER an identical route instead:
//
//   app.get("/protected-wrong", (req, res) => {
//     res.json({ message: "reached with NO real auth check" });
//   });
//   app.use("/protected-wrong", requireAuth);
//
// ...Express would already have matched and answered the request with the
// route above BEFORE requireAuth (registered too late) ever got a turn.
// Verified directly while building this topic: hitting a route built this
// way returns 200 even with NO auth header at all — the "auth check" does
// nothing whatsoever, silently. This is exactly why middleware order is a
// real interview question, not academic trivia.

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4004;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
