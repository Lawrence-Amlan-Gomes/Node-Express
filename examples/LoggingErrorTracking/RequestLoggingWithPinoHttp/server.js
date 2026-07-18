// server.js's job is small on purpose: create the app, wire in the real
// pino-http middleware (this IS genuinely app-level, global middleware
// — it has to see every request), mount the real routes, and start
// listening. No route handler below writes a single log line itself.
//
// pino-http auto-logs EVERY real request that reaches this app — real
// method, real URL, real status code, real response time in ms — with
// zero logging code inside any route handler. This is the real,
// standard way a production Express app gets a complete request log
// for free.
import express from "express";
import pinoHttp from "pino-http";
import { pathToFileURL } from "node:url";
import tasksRouter from "./routes/tasks.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// Real, global request-logging middleware — must run before the real
// routes below, so it can time and log every single request.
app.use(
  pinoHttp({
    // Trims the real req/res objects down to just the useful fields —
    // pino-http's own real default dumps the FULL headers object on
    // every line, confirmed directly while building this example, which
    // is noisy for a demo (and often for real production logs too).
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    // THE REAL GOTCHA, confirmed directly: pino-http's own default
    // level for EVERY request is "info" (30), even a real 500 — the
    // message text changes to "request errored," but the numeric level
    // does not, unless you configure this yourself.
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  }),
);

// Every request is handed off to the real tasks router.
app.use(tasksRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4079;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
