// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and start listening. The real
// route logic — including the real ownership check — lives one layer
// down, in controllers/.
//
// BOLA — Broken Object Level Authorization — is OWASP's real #1 most
// common API vulnerability, found in ~88% of audited Node APIs per
// current research. The bug: an endpoint correctly checks that a
// request is AUTHENTICATED (this really is a real, logged-in user), but
// never checks whether that SPECIFIC user is actually allowed to touch
// the SPECIFIC object being requested — id 42 works no matter whose
// order it actually is.
import express from "express";
import { pathToFileURL } from "node:url";
import ordersRouter from "./routes/orders.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// A real X-User-Id header stands in for "already-verified identity from
// a real auth layer" (JWT/session — see the Authentication Patterns
// topic) — the point of THIS topic is what happens AFTER authentication,
// not how the user got authenticated in the first place. This is real
// app-level, global middleware, so it lives here in server.js.
function identifyUser(req, res, next) {
  // Read the real stand-in identity off the request header.
  const userId = Number(req.get("X-User-Id"));
  if (!userId) {
    // No real identity at all — reject with a real 401.
    res.status(401).json({ error: "X-User-Id header required" });
    // Stop here — without this, the real route handlers would still run.
    return;
  }
  // Attach the real user id so every controller below can read it.
  req.userId = userId;
  // A real identity was found — let the real route handler run next.
  next();
}
app.use(identifyUser);

// Every request is handed off to the real orders router — both the
// vulnerable and fixed routes live at the root path here.
app.use(ordersRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4061;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
