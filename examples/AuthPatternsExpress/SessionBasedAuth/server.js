// server.js's job in a layered app is small on purpose: create the app,
// wire in global middleware, mount each resource's routes, and start
// listening. It should NOT contain the actual logic for any single
// endpoint — that lives in controllers/, one layer down.
import express from "express";
import session from "express-session";
import { pathToFileURL } from "node:url";
import authRouter from "./routes/auth.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /login can read req.body.
app.use(express.json());

// SESSION-BASED AUTH: after a real login, the SERVER creates a real
// session object and stores it server-side (here: in memory — a real
// production app would use a real store like Redis, since an in-memory
// store is wiped on every restart and doesn't work across multiple
// server instances). This is real app-level, global middleware, so it
// lives here in server.js, not in a resource-specific controller.
app.use(
  session({
    secret: "demo-only-session-secret-do-not-reuse-in-real-projects",
    resave: false,
    saveUninitialized: false,
    // Real production apps set { secure: true } too, once served over
    // real HTTPS, so the cookie is never sent over plain HTTP.
    cookie: { httpOnly: true, maxAge: 60_000 },
  }),
);

// Every request is handed off to the real auth router — login, /me, and
// logout all live at the root path here, not under a resource prefix.
app.use(authRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4051;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
