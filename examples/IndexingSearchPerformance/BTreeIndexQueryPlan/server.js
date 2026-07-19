// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and start listening. The real
// Prisma calls and real index management live one layer down, in
// controllers/.
import express from "express";
import { pathToFileURL } from "node:url";
import customersRouter from "./routes/customers.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// Every request under "/customers" is handed off to the real customers router.
app.use("/customers", customersRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4081;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
