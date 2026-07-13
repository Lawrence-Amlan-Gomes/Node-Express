// This example proves that WHERE you register a middleware changes real
// behavior, not just execution order on paper.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// A tiny fake "auth check" middleware: if the right header isn't present,
// it responds with 401 and does NOT call next() — meaning nothing after it
// runs at all for this request. If the header IS present, it calls next()
// and lets the real route handler run.
function requireAuth(req, res, next) {
  if (req.headers["x-auth-token"] === "secret") {
    next();
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
}

// CORRECT order: requireAuth is registered BEFORE the route handler here
// (as a second argument to app.get, which Express treats as "run this
// middleware first, then the real handler"). This route is genuinely
// protected — no valid header, no access.
app.get("/protected-correct", requireAuth, (req, res) => {
  res.json({ message: "you got in — correct order, real auth check ran first" });
});

// WRONG order, on purpose: the route below is registered FIRST, and only
// AFTER that do we register requireAuth for the same path. Express matches
// and runs things in registration order — so a request to GET
// /protected-wrong finds this route handler FIRST, sends its response, and
// requireAuth (registered below, too late) never even gets a chance to run
// for this request. This is exactly why middleware order is a real
// interview question, not academic trivia: the "auth check" here does
// nothing at all, silently.
app.get("/protected-wrong", (req, res) => {
  res.json({ message: "reached with NO real auth check — wrong order let this slip through" });
});
app.use("/protected-wrong", requireAuth);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4004;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
