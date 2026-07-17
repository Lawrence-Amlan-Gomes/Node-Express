// This is a REAL separate file holding its own group of routes — proof that
// "real apps split routes across files" isn't just something we say, it's
// something you can open and see right here. Nothing in this file starts a
// server or even knows what URL prefix it'll be mounted under — it just
// builds a small, self-contained group of routes.
import { Router } from "express";

// Router() gives you a mini version of "app" — you can call .get/.post/.use
// on it exactly like the main app, but it doesn't do anything by itself
// until something else (server.js, in this case) mounts it.
const apiRouter = Router();

// A real route defined on the router itself — it has no idea it'll end up
// mounted at "/api" by server.js, it only knows about "/status".
apiRouter.get("/status", (req, res) => {
  // Send back a real response — proof this route runs even though it never
  // mentions "/api" anywhere in this file.
  res.json({ status: "ok", mountedAt: "/api" });
});

// If this project had more real API routes (users, orders, etc.), they'd
// keep being added here, in this file, one group of related routes — NOT in
// server.js. server.js's only job regarding this router is to import it and
// decide what URL prefix it lives under.
export default apiRouter;
