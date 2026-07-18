// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and start listening. The real
// pino logging calls live one layer down, in controllers/.
//
// console.log is fine for a quick local script, but a real production
// backend needs LOGS, not just printed text — structured, machine-
// readable JSON that a real log-search tool (Datadog, CloudWatch,
// Elastic) can filter and query on, with a real severity level attached
// to every line. pino is a real, fast, widely-used library for exactly
// this.
import express from "express";
import { pathToFileURL } from "node:url";
import tasksRouter from "./routes/tasks.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /tasks can read req.body.
app.use(express.json());

// Every request under "/tasks" is handed off to the real tasks router.
app.use("/tasks", tasksRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4078;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
