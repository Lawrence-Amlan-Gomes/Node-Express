// This example deliberately installs Express 4 (see package.json), NOT
// Express 5 like every other example in this project — the whole point is
// showing the manual pattern real pre-Express-5 codebases have to use.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// THE CORRECT PATTERN for Express 4, and the only route that actually runs
// in this file: wrap the handler's body in try/catch and manually call
// next(err) on failure. This is the pattern every async route handler in a
// real pre-Express-5 codebase needs, every single time — miss it once on
// one route, and that route carries the same risk described in the comment
// below.
app.get("/with-trycatch", async (req, res, next) => {
  try {
    throw new Error("Simulated failure, handled the Express-4 way");
  } catch (err) {
    next(err);
  }
});

// THE MISTAKE (shown only as a comment, never actually run in this project
// — see co-founder/build-conventions.md's "wrong code stays in comments"
// rule). The exact same kind of failure, without the try/catch:
//
//   app.get("/no-trycatch", async (req, res) => {
//     throw new Error("This error has nowhere to go on Express 4");
//   });
//
// On Express 4, this rejected promise is invisible to Express — nobody ever
// calls next(err), and nothing catches it. Verified directly while building
// this topic, by spawning a real Express 4 server and hitting a route
// written exactly like this: modern Node.js (v15+) treats an unhandled
// promise rejection as a FATAL error by default, so the ENTIRE server
// process crashed (a real, observed exit code of 1) — taking every other
// in-flight request on that same server down with it, not just this one.
// This is the real Express 4 footgun that Express 5's automatic rejection
// forwarding (see ../AutomaticForwarding/) fixes at the framework level.

// A real Express 4 error-handling middleware — still detected the same way
// as Express 5: by having exactly 4 arguments, (err, req, res, next).
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4023;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
