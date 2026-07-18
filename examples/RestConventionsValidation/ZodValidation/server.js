// server.js's job in a layered app is small on purpose: create the app,
// wire in global middleware, mount each resource's routes, and start
// listening. It should NOT contain the actual logic for any single
// endpoint — that lives in controllers/, one layer down.
import express from "express";
import { pathToFileURL } from "node:url";
import usersRouter from "./routes/users.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /users can read req.body.
app.use(express.json());

// Every request under "/users" is handed off to the real users router.
// server.js doesn't need to know or care what's inside that file — it
// just hands off anything starting with "/users" to it.
app.use("/users", usersRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4073;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
