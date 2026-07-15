// This route handler is `async`, and it throws an error — but look closely:
// there is NO try/catch anywhere in this file. In Express 4, a rejected
// promise like this (an `async` function that throws is really just a
// function returning a promise that rejects) had NOWHERE to go — Express 4
// had no idea the rejection happened, so the request would just hang
// forever with no response ever sent, and no crash either. That silent-hang
// failure mode is exactly what made this a well-known Express 4 footgun.
//
// Express 5 fixes this at the framework level: when an async route handler's
// returned promise rejects, Express 5 itself catches that rejection and
// forwards it to error handling automatically — the same way it would if you
// had called next(err) yourself. No wrapper library, no try/catch required
// IN THE ROUTE. A real error-handling middleware (below) is still required —
// automatic forwarding means Express finds the error a place to go, not that
// you can skip building that place.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// Deliberately no try/catch here. Throwing inside an `async` function is
// identical to returning a promise that rejects with this error.
app.get("/risky", async (req, res) => {
  throw new Error("Something broke inside this async handler");
});

// A completely unrelated, healthy route — used by the demo to prove the
// server itself is still alive and serving requests normally AFTER /risky
// threw, i.e. the unhandled-looking throw didn't crash the whole process.
app.get("/healthy", (req, res) => {
  res.json({ status: "still running" });
});

// A REAL error-handling middleware — this is what a real backend actually
// ships, and it's what /risky's forwarded rejection lands in. Detected by
// its 4 arguments, (err, req, res, next), exactly like the centralized
// example. Without this, Express would fall back to its own built-in
// default error handler instead — verified directly while building this
// topic: it responds with a full HTML page containing the raw stack trace
// (since NODE_ENV isn't "production"), which a real API should never send
// to a real client. That default-handler fallback is NOT shown as running
// code here on purpose (see co-founder/build-conventions.md's "wrong code
// stays in comments" rule) — a real backend always registers its own
// handler, so this project always does too.
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4021;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
