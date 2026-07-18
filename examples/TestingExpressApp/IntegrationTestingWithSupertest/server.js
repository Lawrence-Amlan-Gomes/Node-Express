// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and start listening. The real
// route logic lives one layer down, in controllers/.
//
// The only thing new here, versus every other topic's server.js, is
// that we export `app` WITHOUT calling .listen() on it during a test —
// Supertest doesn't need a real open network port at all. It hands
// requests straight to Express's own internal request-handling code in
// memory, which is both faster and simpler than starting a real server
// and using fetch() against a real URL.
import express from "express";
import { pathToFileURL } from "node:url";
import tasksRouter from "./routes/tasks.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so a future POST/PATCH on this router could read req.body — kept
// for the same reason every other topic's server.js keeps it by default.
app.use(express.json());

// Every request under "/tasks" is handed off to the real tasks router.
app.use("/tasks", tasksRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// server.test.js imports { app } and hands it straight to Supertest
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4060;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
