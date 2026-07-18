// server.js's job is small on purpose: create the app, mount the real
// routes, register the real process-level safety net, and start
// listening (plus, ONLY when run directly, kick off a real background
// task that deliberately crashes it).
//
// Express 5 already auto-forwards a rejected promise INSIDE an async
// route handler to the centralized error middleware (see the Error
// Handling in Express and Testing an Express App topics) — that's not
// what this section is about. This section is about errors that happen
// OUTSIDE any request at all: a background job, a fire-and-forget
// call, code that runs at startup. Express's own safety net never sees
// those. Without a REAL process.on("uncaughtException"/"unhandledRejection")
// handler, modern Node's own default behavior is to crash the whole
// process — silently, with just a raw stack trace dumped to stderr.
import express from "express";
import { pathToFileURL } from "node:url";
import { logger } from "./logger.js";
import healthRouter from "./routes/health.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Every request is handed off to the real health router.
app.use(healthRouter);

// THE REAL SAFETY NET. Runs for ANY uncaught synchronous throw,
// anywhere in the process — not just inside a route handler.
process.on("uncaughtException", (err) => {
  // fatal is pino's highest real level — this process is about to die.
  logger.fatal({ err }, "uncaught exception — shutting down");
  // Exit on purpose, with a real non-zero code — the process is now in
  // an unknown state and must not keep serving real traffic.
  process.exit(1);
});

// THE REAL SAFETY NET for promises specifically — a promise that
// rejects with nobody ever calling .catch() on it.
process.on("unhandledRejection", (reason) => {
  // Same real fatal level and real logged error as the sync case above.
  logger.fatal({ err: reason }, "unhandled rejection — shutting down");
  // Same real, deliberate non-zero exit.
  process.exit(1);
});

// A real, deliberately broken background task — the exact shape of a
// real cron-style job or a fire-and-forget call gone wrong. Note the
// missing `await` and missing `.catch()` where this gets called below
// — that absence is the whole point.
async function checkForUpdates() {
  // A real, simulated failure — reaching an update service that's down.
  throw new Error("could not reach the real update-check service (simulated)");
}

// Only actually listen (and only actually trigger the real crash) when
// this file is run directly (`node server.js`) — importing `app` alone
// must never trigger it. process.argv[1] is often a relative path while
// import.meta.url is always an absolute file:// URL, so pathToFileURL
// is needed for a correct comparison (see co-founder/build-conventions.md's
// ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4080;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

  // Fired WITHOUT await and WITHOUT .catch() — a real, genuine unhandled
  // rejection the instant this promise settles, exactly like a real
  // background job nobody remembered to wrap in error handling.
  checkForUpdates();
}
