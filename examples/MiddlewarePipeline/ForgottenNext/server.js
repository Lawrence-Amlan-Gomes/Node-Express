// This example proves what calling next() really does: it's the one
// non-negotiable step that lets a request continue past a middleware to
// whatever's registered after it.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// THE CORRECT PATTERN, and the only middleware that actually runs in this
// file: it does a little real work (stamping a timestamp onto the
// request), then calls next() — handing the request on to the route
// handler below.
app.use("/works", (req, res, next) => {
  req.checkedAt = Date.now();
  next();
});
app.get("/works", (req, res) => {
  res.json({ message: "the middleware above called next(), so this route actually ran", checkedAt: req.checkedAt });
});

// THE MISTAKE (shown only as a comment, never actually run in this project
// — see co-founder/build-conventions.md's "wrong code stays in comments"
// rule). A middleware that forgets to call next() (and never sends a
// response either):
//
//   app.use("/hangs", (req, res, next) => {
//     // forgot next() here
//   });
//   app.get("/hangs", (req, res) => {
//     res.json({ message: "never reached" });
//   });
//
// ...doesn't error out. The request just sits there, open, waiting for a
// response that's never coming. Verified directly while building this
// topic with a real timeout race (AbortController): a request built this
// way never completed even after an 800ms wait — genuine proof it hangs,
// not just responds slowly. This is a real, common backend bug, usually an
// accidentally-forgotten next() inside an if-branch, not written on purpose
// like the correct example above.

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4005;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
