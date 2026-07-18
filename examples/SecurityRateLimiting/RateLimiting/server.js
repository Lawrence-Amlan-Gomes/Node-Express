// server.js's job is small on purpose: create the app, mount the real
// routes, and start listening. The real rate-limit config and the real
// route logic both live one layer down, in routes/ and controllers/.
//
// Rate limiting caps how many real requests one real client can make in
// a real time window — without it, a single client (accidental buggy
// retry loop, or a real attacker) can hammer an endpoint as fast as the
// network allows, exhausting real server resources or brute-forcing a
// login endpoint one password guess per request.
import express from "express";
import { pathToFileURL } from "node:url";
import limitedRouter from "./routes/limited.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// Every request is handed off to the real limited router — the rate
// limiter itself is route-specific middleware, declared there, not here.
app.use(limitedRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4062;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
